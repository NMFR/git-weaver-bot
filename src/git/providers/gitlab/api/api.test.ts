/* eslint-disable */
import MockHttpJsonClient from '../../../../common/http/json/Mock';
import GitlabApi from './api';
import GitlabApiError, { ErrorType } from './Error';
import { Method } from '../../../../common/http/json/Client';

import listMrNotesJson from './api.test.listMrNotes';

const authToken = 'DUMMY_TOKEN';
const projectId = '1';
const mergeRequestId = '2';
const message = 'Dummy message';
const sha = 'DUMMY_SHA';

describe('Gitlab API', () => {
  test('acceptMergeRequest success', async () => {
    const client = new MockHttpJsonClient();
    client.response = {
      status: 200,
    };

    const api = new GitlabApi(client, authToken);
    await api.acceptMergeRequest(projectId, mergeRequestId, { squash: true, squashCommitMessage: message, sha });

    expect(client.requestOptions.method).toEqual(Method.PUT);
    expect(client.requestOptions.headers.Authorization).toEqual(`Bearer ${authToken}`);
    expect(client.requestOptions.url).toContain(`/projects/${projectId}/merge_requests/${mergeRequestId}/merge`);
    expect(client.requestOptions.data).toEqual({
      squash: true,
      squash_commit_message: message,
      sha,
    });
  });

  test('acceptMergeRequest throw GitlabApiError', async () => {
    const statusErrorTypeMap: { [status: number]: ErrorType } = {
      405: ErrorType.MergeRequestNotAcceptable,
      406: ErrorType.MergeRequestHasConflicts,
      409: ErrorType.MergeRequestIncorrectSha,
      401: ErrorType.MergeRequestPermissionDenied,
      500: ErrorType.Other,
    };

    for (const [status, errorType] of Object.entries(statusErrorTypeMap)) {
      let error: Error;

      try {
        const client = new MockHttpJsonClient();
        client.response = {
          status: Number(status),
        };

        const api = new GitlabApi(client, authToken);
        await api.acceptMergeRequest(projectId, mergeRequestId, { squash: true, squashCommitMessage: message, sha });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GitlabApiError);
      expect((error as GitlabApiError).type).toEqual(errorType);
    }
  });

  test('commentMergeRequest success', async () => {
    const client = new MockHttpJsonClient();
    client.response = {
      status: 200,
    };

    const api = new GitlabApi(client, authToken);
    await api.commentMergeRequest(projectId, mergeRequestId, message);

    expect(client.requestOptions.method).toEqual(Method.POST);
    expect(client.requestOptions.headers.Authorization).toEqual(`Bearer ${authToken}`);
    expect(client.requestOptions.url).toContain(`/projects/${projectId}/merge_requests/${mergeRequestId}/notes`);
    expect(client.requestOptions.data).toEqual({
      body: message,
    });
  });

  test('commentMergeRequest throw GitlabApiError', async () => {
    let error: Error;

    try {
      const client = new MockHttpJsonClient();
      client.response = {
        status: Number(400),
      };

      const api = new GitlabApi(client, authToken);
      await api.commentMergeRequest(projectId, mergeRequestId, message);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GitlabApiError);
    expect((error as GitlabApiError).type).toEqual(ErrorType.Other);
  });

  test('getCommentMergeRequest success', async () => {
    const client = new MockHttpJsonClient();
    client.response = {
      status: 200,
      data: listMrNotesJson,
    };

    const api = new GitlabApi(client, authToken);
    const comments = await api.getCommentMergeRequest(projectId, mergeRequestId);

    expect(client.requestOptions.method).toEqual(Method.GET);
    expect(client.requestOptions.headers.Authorization).toEqual(`Bearer ${authToken}`);
    expect(client.requestOptions.url).toContain(`/projects/${projectId}/merge_requests/${mergeRequestId}/notes`);
    expect(client.callCount).toEqual(1);
    expect(comments).toHaveLength(2);
  });

  test('getCommentMergeRequest success multiple client calls', async () => {
    const client = new MockHttpJsonClient();
    let data = new Array(100);
    data = data.fill(listMrNotesJson[0]);

    client.response = {
      status: 200,
      data,
    };

    const api = new GitlabApi(client, authToken);
    const comments = await api.getCommentMergeRequest(projectId, mergeRequestId, { itemsPerPage: 200 });

    expect(client.requestOptions.headers.Authorization).toEqual(`Bearer ${authToken}`);
    expect(client.requestOptions.url).toContain(`/projects/${projectId}/merge_requests/${mergeRequestId}/notes`);
    expect(client.callCount).toEqual(2);
    expect(comments).toHaveLength(200);
  });

  test('getCommentMergeRequest throw GitlabApiError', async () => {
    let error: Error;

    try {
      const client = new MockHttpJsonClient();
      client.response = {
        status: Number(400),
      };

      const api = new GitlabApi(client, authToken);
      await api.getCommentMergeRequest(projectId, mergeRequestId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GitlabApiError);
    expect((error as GitlabApiError).type).toEqual(ErrorType.Other);
  });
});
