import Event from './domain/models/events/Event';
import { diContainer } from './dependencyInjection';

export interface EventProcessor {
  (event: Event): void;
}

export default class EventQueue {
  private listeners: EventProcessor[] = [];

  async push(event: Event) {
    await Promise.all(
      this.listeners.map(async l => {
        try {
          await l(event);
        } catch (ex) {
          diContainer.resolve('Logger').error(ex);
        }
      }),
    );
  }

  subscribe(processor: EventProcessor) {
    this.listeners = [...this.listeners, processor];
  }

  unsubscribe(processor: EventProcessor) {
    this.listeners = this.listeners.filter(l => l === processor);
  }
}
