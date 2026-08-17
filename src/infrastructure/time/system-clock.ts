import { Clock } from '../../application/shared/clock';

export class SystemClock implements Clock {
  now(): string {
    return new Date().toISOString();
  }
}
