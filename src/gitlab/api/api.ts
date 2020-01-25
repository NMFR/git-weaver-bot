/* eslint-disable @typescript-eslint/camelcase, camelcase */
import { HttpJsonClient } from '../../httpJsonClient';
import GitlabApiError, { ErrorType } from './Error';
import { Json } from '../../httpJsonClient/client';
import User from '../../domain/models/git/User';
import Comment from '../../domain/models/git/Comment';

export interface Pagination {
  page?: number;
  itemsPerPage?: number;
}

export interface AcceptMergeRequestOptions {
  squash: boolean;
  squashCommitMessage?: string;
  sha?: string;
}
const defaultPagination: Pagination = { page: 1, itemsPerPage: 100 };
const defaultAcceptMergeRequestOptions: AcceptMergeRequestOptions = { squash: true };
const ACCEPT_MERGE_REQUEST_STATUS_ERROR_TYPE_MAP: { [status: number]: ErrorType } = {
  405: ErrorType.MergeRequestNotAcceptable,
  406: ErrorType.MergeRequestHasConflicts,
  409: ErrorType.MergeRequestIncorrectSha,
  401: ErrorType.MergeRequestPermissionDenied,
};

export default class GitlabApi {
  private static getPaginationQueryString(pagination?: Pagination) {
    const paginationWithDefaults: Pagination = { ...defaultPagination, ...pagination };

    return `per_page=${paginationWithDefaults.itemsPerPage}&page=${paginationWithDefaults.page}`;
  }

  private static parseJsonUser(json: Json): User {
    const user = {
      id: json?.id,
      username: json?.username,
      name: json?.name,
      email: json?.email,
    };

    return user;
  }

  private static parseJsonComment(json: Json): Comment {
    const comment = {
      id: json?.id,
      text: json?.body,
      author: GitlabApi.parseJsonUser(json?.author),
      createdAt: json?.created_at ? new Date(json?.created_at) : null,
      updatedAt: json?.updated_at ? new Date(json?.updated_at) : null,
    };

    return comment;
  }

  private client: HttpJsonClient;

  private authToken: string;

  constructor(client: HttpJsonClient, authToken: string) {
    this.client = client;
    this.authToken = authToken;
  }

  private async internalGetCommentMergeRequest(
    repositoryId: string,
    mergeRequestId: string,
    options?: Pagination,
  ): Promise<Comment[]> {
    const response = await this.client.get(
      `https://gitlab.com/api/v4/projects/${repositoryId}/merge_requests/${mergeRequestId}/notes?sort=asc&${GitlabApi.getPaginationQueryString(
        options,
      )}`,
      {
        Authorization: `Bearer ${this.authToken}`,
      },
    );

    if (response.status !== 200) {
      throw new GitlabApiError('Failed to comment the merge request', {
        type: ErrorType.Other,
        apiResponseStatus: response.status,
        apiResponse: response.data,
      });
    }

    return response?.data?.map(GitlabApi.parseJsonComment);
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
      throw new GitlabApiError('Failed to accept the merge request', {
        type: ACCEPT_MERGE_REQUEST_STATUS_ERROR_TYPE_MAP[response.status] ?? ErrorType.Other,
        apiResponseStatus: response.status,
        apiResponse: response.data,
      });
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
      throw new GitlabApiError('Failed to comment the merge request', {
        type: ErrorType.Other,
        apiResponseStatus: response.status,
        apiResponse: response.data,
      });
    }
  }

  async getCommentMergeRequest(repositoryId: string, mergeRequestId: string, options?: Pagination): Promise<Comment[]> {
    const maxItems = options?.itemsPerPage ?? null;
    const itemsPerPage = maxItems != null && maxItems < 100 ? maxItems : 100;
    const comments = [];
    let page = maxItems == null ? 1 : options?.page ?? 1;
    let commentsSlice;

    do {
      // eslint-disable-next-line no-await-in-loop
      commentsSlice = await this.internalGetCommentMergeRequest(repositoryId, mergeRequestId, {
        page,
        itemsPerPage,
      });

      page += 1;

      comments.push(...commentsSlice);
    } while (commentsSlice.length >= itemsPerPage && (maxItems == null || comments.length < maxItems));

    return comments;
  }
}
