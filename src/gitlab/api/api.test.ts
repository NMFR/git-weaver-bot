/* eslint-disable */
import MockHttpJsonClient from '../../httpJsonClient/mock';
import GitlabApi from './api';
import GitlabApiError, { ErrorType } from './error';

const authToken = 'DUMMY_TOKEN';
const projectId = '1';
const mergeRequestId = '2';
const squashCommitMessage = 'Dummy commit message';
const sha = 'DUMMY_SHA';

describe('Gitlab API', () => {
  test('acceptMergeRequest success', async () => {
    const client = new MockHttpJsonClient();
    client.response = {
      status: 200,
    };

    const api = new GitlabApi(client, authToken);
    await api.acceptMergeRequest(projectId, mergeRequestId, { squash: true, squashCommitMessage, sha });

    expect(client.requestOptions.headers.Authorization).toEqual(`Bearer ${authToken}`);
    expect(client.requestOptions.url).toContain(`/projects/${projectId}/merge_requests/${mergeRequestId}/merge`);
    expect(client.requestOptions.data).toEqual({
      squash: true,
      squash_commit_message: squashCommitMessage,
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
        await api.acceptMergeRequest(projectId, mergeRequestId, { squash: true, squashCommitMessage, sha });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GitlabApiError);
      expect((error as GitlabApiError).type).toEqual(errorType);
    }
  });
});
