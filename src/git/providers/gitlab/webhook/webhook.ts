/* eslint-disable @typescript-eslint/camelcase, camelcase */
import { Router } from 'express';

export interface CreateWebhookOptions {
  token?: string;
}

export default function createWebhook(options?: CreateWebhookOptions): Router {
  const router = Router();

  router.post('/', (request, response) => {
    const jsonData = request.body;

    if (options?.token && request.header('X-Gitlab-Token') !== options?.token) {
      console.log(`Gitlab webhook failed token check, received token: ${request.header('X-Gitlab-Token')}`, jsonData);
      return response.status(401).send();
    }

    switch (jsonData?.object_kind) {
      case 'push':
        console.log('New commits pushed', jsonData);
        break;

      case 'tag_push':
        console.log('New tag pushed', jsonData);
        break;

      case 'issue':
        console.log('New issue event', jsonData);
        break;

      case 'note':
        switch (jsonData?.object_attributes?.noteable_type) {
          case 'Commit':
            console.log('New comment on a commit', jsonData);
            break;

          case 'MergeRequest':
            console.log('New comment on a merge request', jsonData);
            break;

          case 'Issue':
            console.log('New comment on an issue', jsonData);
            break;

          case 'Snippet':
            console.log('New comment on a snippet', jsonData);
            break;

          default:
            console.log('New comment on an unknown object', jsonData);
            break;
        }
        break;

      case 'merge_request':
        console.log('New merge request event', jsonData);
        break;

      case 'wiki_page':
        console.log('New wiki page event', jsonData);
        break;

      case 'pipeline':
        console.log('New pipeline event', jsonData);
        break;

      case 'build':
        console.log('New job event', jsonData);
        break;

      default:
        console.log('Unknown event', jsonData);
        break;
    }

    return response.status(200).send();
  });

  return router;
}
