import Event from './Event';
import EventType from './EventType';
import MergeRequest from '../git/MergeRequest';

export default class NewMergeRequest extends Event {
  mergeRequest: MergeRequest;

  constructor(mergeRequest: MergeRequest) {
    super(EventType.newMergeRequest);

    this.mergeRequest = mergeRequest;
  }
}
