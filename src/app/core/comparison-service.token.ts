import { InjectionToken } from '@angular/core';
import { ComparisonService } from '../../application/comparison/comparison-service';

export const COMPARISON_SERVICE = new InjectionToken<ComparisonService>('COMPARISON_SERVICE', {
  providedIn: 'root',
  factory: () => new ComparisonService(),
});
