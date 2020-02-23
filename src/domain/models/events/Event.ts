import EventType from './EventType';

export default abstract class Event {
  readonly type: EventType;

  readonly date: Date;

  protected constructor(type: EventType) {
    this.type = type;
    this.date = new Date();
  }
}
