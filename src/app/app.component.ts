import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class AppComponent {}
