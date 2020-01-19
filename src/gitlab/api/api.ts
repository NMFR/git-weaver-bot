/* eslint-disable @typescript-eslint/camelcase */
import { HttpJsonClient } from '../../httpJsonClient';
import GitlabApiError, { ErrorType } from './error';

export interface AcceptMergeRequestOptions {
  squash: boolean;
  squashCommitMessage?: string;
  sha?: string;
}
const defaultAcceptMergeRequestOptions = { squash: true };
const ACCEPT_MERGE_REQUEST_STATUS_ERROR_TYPE_MAP: { [status: number]: ErrorType } = {
  405: ErrorType.MergeRequestNotAcceptable,
  406: ErrorType.MergeRequestHasConflicts,
  409: ErrorType.MergeRequestIncorrectSha,
  401: ErrorType.MergeRequestPermissionDenied,
};

export default class GitlabApi {
  private client: HttpJsonClient;

  private authToken: string;

  constructor(client: HttpJsonClient, authToken: string) {
    this.client = client;
    this.authToken = authToken;
  }

  async acceptMergeRequest(repositoryId: string, mergeRequestId: string, options?: AcceptMergeRequestOptions) {
    const optionsWithDefaults: AcceptMergeRequestOptions = { ...defaultAcceptMergeRequestOptions, ...options };

    const response = await this.client.put(
      `https://gitlab.com/api/v4/projects/${repositoryId}/merge_requests/${mergeRequestId}/merge`,
      {
        squash: optionsWithDefaults?.squash,
        squash_commit_message: optionsWithDefaults?.squashCommitMessage,
        sha: options?.sha,
      },
      {
        Authorization: `Bearer ${this.authToken}`,
      },
    );

    if (response.status !== 200) {
      throw new GitlabApiError(
        'Failed to accept the merge request',
        ACCEPT_MERGE_REQUEST_STATUS_ERROR_TYPE_MAP[response.status] ?? ErrorType.Other,
        response.status,
        response.data,
      );
    }
  }

  async commentMergeRequest(repositoryId: string, mergeRequestId: string, comment: string) {
    const response = await this.client.post(
      `https://gitlab.com/api/v4/projects/${repositoryId}/merge_requests/${mergeRequestId}/notes`,
      {
        body: comment,
      },
      {
        Authorization: `Bearer ${this.authToken}`,
      },
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new GitlabApiError('Failed to comment the merge request', ErrorType.Other, response.status, response.data);
    }
  }
}
