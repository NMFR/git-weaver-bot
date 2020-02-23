import User from './User';

export default interface MergeRequest {
  id: string;
  repositoryId: string;
  title: string;
  description: string;
  labels: string[];
  targetBranch: string;
  sourceBranch: string;
  author: User;
  assignees: User[];
  createdAt: Date;
  updatedAt: Date;

  getComments(): Promise<Comment[]>;
}
