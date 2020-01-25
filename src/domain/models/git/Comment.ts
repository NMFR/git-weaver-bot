import User from './User';

export default interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}
