import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  it('keeps glossary navigation out of settings and exposes future support as informational copy', async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPageComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const supportDock = element.querySelector<HTMLElement>('.settings-support-dock');

    expect(element.querySelector('.settings-link')).toBeNull();
    expect(element.querySelector('a[href*="glossary"]')).toBeNull();
    expect(supportDock?.tagName).toBe('DIV');
    expect(supportDock?.getAttribute('role')).toBe('note');
    expect(element.querySelector('.support-settings-action')?.getAttribute('role')).toBe('note');
  });
});
