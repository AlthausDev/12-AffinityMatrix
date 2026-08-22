import { TestBed } from '@angular/core/testing';
import { CompletionProgressComponent } from './completion-progress.component';

describe('CompletionProgressComponent', () => {
  it('uses clearly separated color bands as completion increases', async () => {
    await TestBed.configureTestingModule({
      imports: [CompletionProgressComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CompletionProgressComponent);
    const cases: readonly [number, string][] = [
      [10, 'progress-danger'],
      [25, 'progress-low'],
      [50, 'progress-mid'],
      [70, 'progress-high'],
      [90, 'progress-complete'],
    ];

    for (const [value, expectedClass] of cases) {
      fixture.componentRef.setInput('value', value);
      fixture.detectChanges();
      const fill = fixture.nativeElement.querySelector('.completion-progress span') as HTMLElement;
      expect(fill.classList.contains(expectedClass)).toBe(true);
      expect(fill.style.width).toBe(`${value}%`);
    }
  });

  it('clamps completion to the zero-to-one-hundred range', async () => {
    await TestBed.configureTestingModule({
      imports: [CompletionProgressComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CompletionProgressComponent);

    fixture.componentRef.setInput('value', 140);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('.completion-progress span') as HTMLElement).style.width).toBe('100%');

    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('.completion-progress span') as HTMLElement).style.width).toBe('0%');
  });
});
