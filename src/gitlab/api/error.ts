import CustomError from '../../CustomError';

export enum ErrorType {
  MergeRequestNotAcceptable, // ie: Work in Progress, Closed, Pipeline Pending Completion, or Failed while requiring Success
  MergeRequestHasConflicts,
  MergeRequestIncorrectSha,
  MergeRequestPermissionDenied,

  Other,
}

export default class GitlabApiError extends CustomError {
  type: ErrorType;

  apiResponseStatus?: number;

  apiResponse?: any;

  constructor(message: string, type: ErrorType = ErrorType.Other, apiResponseStatus?: number, apiResponse?: any) {
    super(message);
    this.type = type;
    this.apiResponseStatus = apiResponseStatus;
    this.apiResponse = apiResponse;
  }
}
