import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileStore } from '../../core/profile.store';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main class="page">
      <header class="page-header home-header">
        <div>
          <p class="eyebrow">MVP · 0.1.0.0</p>
          <h1>Affinity Matrix</h1>
          <p class="muted lead">
            Create portable preference profiles and compare them locally. The working title may
            change as the product evolves.
          </p>
        </div>
        <div class="header-actions">
          <a class="button" routerLink="/profiles/new">Create profile</a>
          <button class="button secondary" type="button" disabled>Import profile</button>
        </div>
      </header>

      @if (profileStore.error()) {
        <p class="alert" role="alert">{{ profileStore.error() }}</p>
      }

      <section aria-labelledby="local-profiles-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">This browser</p>
            <h2 id="local-profiles-title">Local profiles</h2>
          </div>
          <span class="count-badge">{{ profileStore.profiles().length }}</span>
        </div>

        @if (profileStore.profiles().length === 0) {
          <div class="panel empty-state">
            <h3>No profiles yet</h3>
            <p class="muted">
              Create the first profile. It will be stored only in this browser until you explicitly
              export or share it.
            </p>
            <a class="button" routerLink="/profiles/new">Create profile</a>
          </div>
        } @else {
          <div class="profile-list">
            @for (profile of profileStore.profiles(); track profile.id) {
              <a class="profile-row" [routerLink]="['/profiles', profile.id]">
                <div>
                  <strong>{{ profile.metadata.alias || 'Untitled profile' }}</strong>
                  <span class="muted">
                    {{ answerCount(profile.answers) }} answered ·
                    {{ profile.metadata.filterByProfileMetadata ? 'filter enabled' : 'full questionnaire' }}
                  </span>
                </div>
                <span aria-hidden="true">→</span>
              </a>
            }
          </div>
        }
      </section>

      <footer class="privacy-note">
        <strong>Local by default.</strong>
        <span class="muted">Profiles stay on this device unless you explicitly export them.</span>
      </footer>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);

  answerCount(answers: object): number {
    return Object.keys(answers).length;
  }
}
