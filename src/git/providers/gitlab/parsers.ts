/* eslint-disable @typescript-eslint/camelcase, camelcase */
import MergeRequest from '../../../domain/models/git/MergeRequest';
import { Json } from '../../../common/http/json/Client';
import User from './models/User';
import Comment from '../../../domain/models/git/Comment';

export function parseUser(json: Json): User {
  const user = new User();

  user.id = json?.id;
  user.username = json?.username;
  user.name = json?.name;
  user.email = json?.email;

  return user;
}

export function parseComment(json: Json): Comment {
  const comment = {
    id: json?.id,
    text: json?.body,
    author: parseUser(json?.author),
    createdAt: json?.created_at ? new Date(json?.created_at) : null,
    updatedAt: json?.updated_at ? new Date(json?.updated_at) : null,
  };

  return comment;
}

export function parseNote(json: Json): Comment {
  const comment = {
    id: json?.id,
    text: json?.note,
    author: parseUser(json?.author),
    createdAt: json?.created_at ? new Date(json?.created_at) : null,
    updatedAt: json?.updated_at ? new Date(json?.updated_at) : null,
  };

  comment.author.id = comment.author.id || json?.author_id;

  return comment;
}

export function parseMergeRequest(json: Json): MergeRequest {
  const mr = {
    id: json?.id,
    repositoryId: '',
    title: json?.title,
    description: json?.description,
    labels: [] as string[],
    targetBranch: json?.target_branch,
    sourceBranch: json?.source_branch,
    author: parseUser(json?.author),
    assignees: [parseUser(json?.assignee)],
    createdAt: json?.created_at ? new Date(json?.created_at) : null,
    updatedAt: json?.updated_at ? new Date(json?.updated_at) : null,
  };

  mr.author.id = mr.author.id || json?.author_id;

  return mr;
}
