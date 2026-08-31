import { TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  it('uses native button semantics for language choices', async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(LanguageSwitcherComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const trigger = element.querySelector<HTMLButtonElement>('.language-trigger');
    const options = element.querySelector<HTMLElement>('#language-options');
    const languageButtons = [...element.querySelectorAll<HTMLButtonElement>('.language-option')];

    expect(trigger?.getAttribute('aria-controls')).toBe('language-options');
    expect(options?.getAttribute('role')).toBe('group');
    expect(languageButtons.length).toBeGreaterThan(1);
    expect(languageButtons.every((button) => button.getAttribute('role') === null)).toBe(true);
    expect(languageButtons.some((button) => button.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('closes on Escape and returns focus to the language trigger', async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(LanguageSwitcherComponent);
    const component = fixture.componentInstance;
    component.menuOpen.set(true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const trigger = element.querySelector<HTMLButtonElement>('.language-trigger')!;
    const option = element.querySelector<HTMLButtonElement>('.language-option')!;
    option.focus();
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(component.menuOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});
