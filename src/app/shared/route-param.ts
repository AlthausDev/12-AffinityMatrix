import { ActivatedRoute } from '@angular/router';

export function findRouteParam(route: ActivatedRoute, name: string): string | null {
  let current: ActivatedRoute | null = route;

  while (current) {
    const value = current.snapshot.paramMap.get(name);
    if (value !== null) return value;
    current = current.parent;
  }

  return null;
}
