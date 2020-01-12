/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

export interface AcceptMergeRequestOptions {
  squash: boolean;
  squashCommitMessage?: string;
}
const defaultAcceptMergeRequestOptions = { squash: true };

export default class GitlabApi {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  async acceptMergeRequest(repositoryId: string, mergeRequestId: string, options?: AcceptMergeRequestOptions) {
    const optionsWithDefaults: AcceptMergeRequestOptions = { ...defaultAcceptMergeRequestOptions, ...options };

    await axios.put(
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
      },
    );
  }
}
