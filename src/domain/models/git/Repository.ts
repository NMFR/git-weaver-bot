export default interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  defaultBranch: string;
  createdAt: Date;
  updatedAt: Date;
}
