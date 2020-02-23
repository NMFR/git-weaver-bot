/* eslint-disable @typescript-eslint/camelcase, camelcase */
import { Router } from 'express';
import NewMergeRequest from '../../../../domain/models/events/NewMergeRequest';
import { diContainer } from '../../../../dependencyInjection';
import NewMergeRequestComment from '../../../../domain/models/events/NewMergeRequestComment';
import { parseNote, parseMergeRequest } from '../parsers';

export interface CreateWebhookOptions {
  token?: string;
}

export default function createWebhook(options?: CreateWebhookOptions): Router {
  const router = Router();

  router.post('/', (request, response) => {
    const jsonData = request.body;

    if (options?.token && request.header('X-Gitlab-Token') !== options?.token) {
      diContainer
        .resolve('Logger')
        .debug(`Gitlab webhook failed token check, received token: ${request.header('X-Gitlab-Token')}`, jsonData);
      return response.status(401).send();
    }

    switch (jsonData?.object_kind) {
      case 'push':
        diContainer.resolve('Logger').debug('New commits pushed', jsonData);
        break;

      case 'tag_push':
        diContainer.resolve('Logger').debug('New tag pushed', jsonData);
        break;

      case 'issue':
        diContainer.resolve('Logger').debug('New issue event', jsonData);
        break;

      case 'note':
        switch (jsonData?.object_attributes?.noteable_type) {
          case 'Commit': {
            diContainer.resolve('Logger').debug('New comment on a commit', jsonData);
            const comment = parseNote(jsonData?.object_attributes);
            const mergeRequest = parseMergeRequest(jsonData?.merge_request);
            diContainer.resolve('EventQueue').push(new NewMergeRequestComment(comment, mergeRequest));
            break;
          }
          case 'MergeRequest':
            diContainer.resolve('Logger').debug('New comment on a merge request', jsonData);
            break;

          case 'Issue':
            diContainer.resolve('Logger').debug('New comment on an issue', jsonData);
            break;

          case 'Snippet':
            diContainer.resolve('Logger').debug('New comment on a snippet', jsonData);
            break;

          default:
            diContainer.resolve('Logger').debug('New comment on an unknown object', jsonData);
            break;
        }
        break;

      case 'merge_request': {
        diContainer.resolve('Logger').debug('New merge request event', jsonData);
        const mergeRequest = parseMergeRequest(jsonData?.object_attributes);
        diContainer.resolve('EventQueue').push(new NewMergeRequest(mergeRequest));
        break;
      }
      case 'wiki_page':
        diContainer.resolve('Logger').debug('New wiki page event', jsonData);
        break;

      case 'pipeline':
        diContainer.resolve('Logger').debug('New pipeline event', jsonData);
        break;

      case 'build':
        diContainer.resolve('Logger').debug('New job event', jsonData);
        break;

      default:
        diContainer.resolve('Logger').debug('Unknown event', jsonData);
        break;
    }

    return response.status(200).send();
  });

  return router;
}
