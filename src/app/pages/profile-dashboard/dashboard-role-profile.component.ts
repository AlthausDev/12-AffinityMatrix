import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Practice, RolePerspective } from '../../../domain/catalogue/practice';
import { Profile } from '../../../domain/profile/profile';
import { TranslationService } from '../../i18n/translation.service';
import {
  buildRoleProfile,
  buildRoleProfileCoordinates,
  RoleProfileEntry,
} from './profile-dashboard-insights';

@Component({
  selector: 'app-dashboard-role-profile',
  template: `
    <article class="dashboard-chart-card dashboard-role-card">
      <header class="dashboard-chart-heading">
        <div>
          <h3>{{ i18n.t('dashboard.roleProfile.title') }}</h3>
          <p>{{ text(
            'Separa afinidad dentro de cada rol y peso de ese rol dentro de tus preferencias positivas.',
            'Separates affinity within each role from that role’s weight across your positive preferences.'
          ) }}</p>
        </div>
      </header>

      @if (roleProfileAnswerCount() > 0) {
        <div class="dashboard-role-legend">
          <span>
            <span class="dashboard-role-legend-swatch dashboard-role-legend-swatch-affinity" aria-hidden="true"></span>
            {{ text('Afinidad dentro del rol', 'Affinity within role') }}
          </span>
          <span>
            <span class="dashboard-role-legend-swatch dashboard-role-legend-swatch-weight" aria-hidden="true"></span>
            {{ text('Peso dentro del perfil', 'Weight within profile') }}
          </span>
        </div>

        <div class="dashboard-role-profile">
          @for (entry of roleProfile(); track entry.perspective) {
            <div class="dashboard-role-row" [class.dashboard-role-row-empty]="entry.answerCount === 0">
              <div class="dashboard-role-row-heading">
                <strong>{{ rolePerspectiveLabel(entry.perspective) }}</strong>
                <span>{{ roleProfileAnswerLabel(entry.answerCount) }}</span>
              </div>

              <div class="dashboard-role-metrics">
                <div class="dashboard-role-metric">
                  <div class="dashboard-role-metric-label">
                    <span>{{ text('Afinidad', 'Affinity') }}</span>
                    <strong>{{ entry.affinityPercentage }}%</strong>
                  </div>
                  <div
                    class="dashboard-role-track"
                    role="img"
                    [attr.aria-label]="roleMetricAriaLabel(entry, 'affinity')"
                  >
                    <span class="dashboard-role-fill dashboard-role-fill-affinity" [style.width.%]="entry.affinityPercentage"></span>
                  </div>
                </div>

                <div class="dashboard-role-metric">
                  <div class="dashboard-role-metric-label">
                    <span>{{ text('Peso del perfil', 'Profile weight') }}</span>
                    <strong>{{ entry.profileWeightPercentage }}%</strong>
                  </div>
                  <div
                    class="dashboard-role-track"
                    role="img"
                    [attr.aria-label]="roleMetricAriaLabel(entry, 'weight')"
                  >
                    <span class="dashboard-role-fill dashboard-role-fill-weight" [style.width.%]="entry.profileWeightPercentage"></span>
                  </div>
                </div>
              </div>

              <div class="dashboard-role-row-meta">
                <span>{{ i18n.t('dashboard.roleProfile.favorites') }}</span>
                <strong>{{ entry.favoritePercentage }}%</strong>
              </div>
            </div>
          }
        </div>

        <section class="dashboard-role-spectra" [attr.aria-label]="text('Tendencias de rol', 'Role tendencies')">
          <div class="dashboard-role-spectrum-block">
            <div class="dashboard-role-spectrum-heading">
              <div>
                <strong>{{ text('Tendencia activa / receptiva', 'Active / receptive tendency') }}</strong>
                <small>{{ text(
                  'Compara únicamente la afinidad ponderada de roles activos y receptivos; los roles mutuos se muestran arriba como una dimensión propia.',
                  'Compares weighted active and receptive affinity only; mutual roles remain visible above as their own dimension.'
                ) }}</small>
              </div>
              <span>{{ roleDirectionEvidenceLabel() }}</span>
            </div>

            <div class="dashboard-role-spectrum" role="img" [attr.aria-label]="roleSpectrumAriaLabel()">
              <div class="dashboard-role-spectrum-labels" aria-hidden="true">
                <span>{{ i18n.t('dashboard.roleProfile.receptive') }}</span>
                <span>{{ i18n.t('dashboard.roleProfile.balanceCenter') }}</span>
                <span>{{ i18n.t('dashboard.roleProfile.active') }}</span>
              </div>
              <div class="dashboard-role-spectrum-rail">
                <span class="dashboard-role-spectrum-midline" aria-hidden="true"></span>
                <span
                  class="dashboard-role-spectrum-marker"
                  [style.left.%]="roleCoordinateLeft()"
                  aria-hidden="true"
                ></span>
              </div>
            </div>
          </div>

          <div class="dashboard-role-spectrum-block dashboard-role-spectrum-initiative">
            <div class="dashboard-role-spectrum-heading">
              <div>
                <strong>{{ text('Preferencia de iniciativa', 'Initiative preference') }}</strong>
                <small>{{ text(
                  'Usa sólo las respuestas donde has indicado explícitamente quién prefieres que tome la iniciativa.',
                  'Uses only answers where you explicitly stated who you prefer to take the initiative.'
                ) }}</small>
              </div>
              @if (roleProfileCoordinates().initiativeEvidenceCount > 0) {
                <span>{{ roleInitiativeEvidenceLabel() }}</span>
              }
            </div>

            @if (roleProfileCoordinates().initiativeEvidenceCount > 0) {
              <div class="dashboard-role-spectrum" role="img" [attr.aria-label]="initiativeSpectrumAriaLabel()">
                <div class="dashboard-role-spectrum-labels" aria-hidden="true">
                  <span>{{ i18n.t('dashboard.roleProfile.initiativePartner') }}</span>
                  <span>{{ text('Flexible', 'Flexible') }}</span>
                  <span>{{ i18n.t('dashboard.roleProfile.initiativeSelf') }}</span>
                </div>
                <div class="dashboard-role-spectrum-rail dashboard-role-spectrum-rail-initiative">
                  <span class="dashboard-role-spectrum-midline" aria-hidden="true"></span>
                  <span
                    class="dashboard-role-spectrum-marker dashboard-role-spectrum-marker-initiative"
                    [style.left.%]="initiativeCoordinateLeft()"
                    aria-hidden="true"
                  ></span>
                </div>
              </div>
            } @else {
              <p class="dashboard-role-initiative-empty">{{ i18n.t('dashboard.roleProfile.initiativeMissing') }}</p>
            }
          </div>
        </section>
      } @else {
        <div class="dashboard-chart-empty">
          <span aria-hidden="true">◇</span>
          <p>{{ i18n.t('dashboard.roleProfile.empty') }}</p>
        </div>
      }
    </article>
  `,
  styles: `:host { display: block; min-width: 0; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRoleProfileComponent {
  readonly profile = input<Profile | undefined>();
  readonly practices = input<readonly Practice[] | undefined>();
  readonly i18n = inject(TranslationService);

  readonly roleProfile = computed(() => buildRoleProfile(this.profile(), this.practices()));
  readonly roleProfileCoordinates = computed(() => buildRoleProfileCoordinates(this.profile(), this.practices()));
  readonly roleProfileAnswerCount = computed(() =>
    this.roleProfile().reduce((sum, entry) => sum + entry.answerCount, 0),
  );

  rolePerspectiveLabel(perspective: RolePerspective): string {
    if (perspective === 'active') return this.i18n.t('dashboard.roleProfile.active');
    if (perspective === 'receptive') return this.i18n.t('dashboard.roleProfile.receptive');
    return this.i18n.t('dashboard.roleProfile.neutral');
  }

  roleProfileAnswerLabel(count: number): string {
    return this.i18n.plural(
      count,
      'dashboard.roleProfile.answers.one',
      'dashboard.roleProfile.answers.other',
    );
  }

  roleCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().roleBalance);
  }

  initiativeCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().initiativeBalance);
  }

  roleDirectionEvidenceLabel(): string {
    const count = this.roleProfileCoordinates().roleEvidenceCount;
    return this.text(
      `${count} ${count === 1 ? 'rol medido' : 'roles medidos'}`,
      `${count} measured ${count === 1 ? 'role' : 'roles'}`,
    );
  }

  roleInitiativeEvidenceLabel(): string {
    const count = this.roleProfileCoordinates().initiativeEvidenceCount;
    return this.i18n.plural(
      count,
      'dashboard.roleProfile.initiativeEvidence.one',
      'dashboard.roleProfile.initiativeEvidence.other',
    );
  }

  roleMetricAriaLabel(entry: RoleProfileEntry, metric: 'affinity' | 'weight'): string {
    const label = metric === 'affinity'
      ? this.text('Afinidad dentro del rol', 'Affinity within role')
      : this.text('Peso dentro del perfil', 'Weight within profile');
    const value = metric === 'affinity' ? entry.affinityPercentage : entry.profileWeightPercentage;
    return `${this.rolePerspectiveLabel(entry.perspective)} · ${label} ${value}%`;
  }

  roleSpectrumAriaLabel(): string {
    const coordinates = this.roleProfileCoordinates();
    return `${this.text('Tendencia activa / receptiva', 'Active / receptive tendency')} · ${this.i18n.t('dashboard.roleProfile.receptive')} ↔ ${this.i18n.t('dashboard.roleProfile.active')}: ${coordinates.roleBalance}`;
  }

  initiativeSpectrumAriaLabel(): string {
    const coordinates = this.roleProfileCoordinates();
    return `${this.text('Preferencia de iniciativa', 'Initiative preference')} · ${this.i18n.t('dashboard.roleProfile.initiativePartner')} ↔ ${this.i18n.t('dashboard.roleProfile.initiativeSelf')}: ${coordinates.initiativeBalance}`;
  }

  text(es: string, en: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }
}

function coordinateLeft(value: number): number {
  return Math.max(6, Math.min(94, 50 + value * 0.44));
}
