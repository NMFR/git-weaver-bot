import Event from './Event';
import EventType from './EventType';
import Comment from '../git/Comment';
import MergeRequest from '../git/MergeRequest';

export default class NewMergeRequestComment extends Event {
  comment: Comment;

  mergeRequest: MergeRequest;

  constructor(comment: Comment, mergeRequest: MergeRequest) {
    super(EventType.newMergeRequestComment);

    this.comment = comment;
    this.mergeRequest = mergeRequest;
  }
}
