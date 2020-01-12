/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

import GitlabApiError, { ErrorType } from './Error';

export interface AcceptMergeRequestOptions {
  squash: boolean;
  squashCommitMessage?: string;
}
const defaultAcceptMergeRequestOptions = { squash: true };
const ACCEPT_MERGE_REQUEST_STATUS_ERROR_TYPE_MAP: { [status: number]: ErrorType } = {
  405: ErrorType.MergeRequestNotAcceptable,
  406: ErrorType.MergeRequestHasConflicts,
  409: ErrorType.MergeRequestIncorrectSha,
  401: ErrorType.MergeRequestPermissionDenied,
};

export default class GitlabApi {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  async acceptMergeRequest(repositoryId: string, mergeRequestId: string, options?: AcceptMergeRequestOptions) {
    const optionsWithDefaults: AcceptMergeRequestOptions = { ...defaultAcceptMergeRequestOptions, ...options };

    const response = await axios.put(
      `https://gitlab.com/api/v4/projects/${repositoryId}/merge_requests/${mergeRequestId}/merge`,
      {
        squash: optionsWithDefaults?.squash,
        squash_commit_message: optionsWithDefaults?.squashCommitMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        responseType: 'json',
        validateStatus: () => true,
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
}
