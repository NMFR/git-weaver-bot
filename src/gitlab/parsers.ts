/* eslint-disable @typescript-eslint/camelcase, camelcase */
import { Json } from '../httpJsonClient/client';
import User from './User';
import Comment from '../domain/models/git/Comment';

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
