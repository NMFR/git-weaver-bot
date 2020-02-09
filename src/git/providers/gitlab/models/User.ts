import UserInterface from '../../../../domain/models/git/User';

export default class User implements UserInterface {
  id: string;

  username: string;

  name: string;

  email: string;

  textIdentifier(): string {
    return `@${this.username}`;
  }
}
