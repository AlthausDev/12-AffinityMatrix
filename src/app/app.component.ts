import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiPreferencesService } from './core/ui-preferences.service';
import { LanguageSwitcherComponent } from './i18n/language-switcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcherComponent],
  template: `
    <app-language-switcher />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly uiPreferences = inject(UiPreferencesService);

  constructor() {
    this.uiPreferences.initialize();
  }
}
