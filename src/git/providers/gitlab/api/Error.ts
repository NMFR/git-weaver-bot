import CustomError from '../../../../common/CustomError';

export enum ErrorType {
  MergeRequestNotAcceptable, // ie: Work in Progress, Closed, Pipeline Pending Completion, or Failed while requiring Success
  MergeRequestHasConflicts,
  MergeRequestIncorrectSha,
  MergeRequestPermissionDenied,

  Other,
}

export interface GitlabApiErrorOptions {
  inner?: Error | null;
  type: ErrorType;
  apiResponseStatus?: number;
  apiResponse?: any;
}

const DEFAULT_OPTIONS: GitlabApiErrorOptions = {
  inner: null,
  type: ErrorType.Other,
};

export default class GitlabApiError extends CustomError {
  type: ErrorType;

  apiResponseStatus?: number;

  apiResponse?: any;

  constructor(message: string, options?: GitlabApiErrorOptions) {
    const optionsDefaults: GitlabApiErrorOptions = { ...DEFAULT_OPTIONS, ...options };

    super(message, optionsDefaults?.inner);

    this.type = optionsDefaults?.type;
    this.apiResponseStatus = optionsDefaults?.apiResponseStatus;
    this.apiResponse = optionsDefaults?.apiResponse;
  }
}
