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
            'Resume cómo encajan tus respuestas en tres formas de participar: realizar la acción, recibirla o compartirla.',
            'Summarizes how your answers fit three ways of taking part: performing the action, receiving it, or sharing it.'
          ) }}</p>
        </div>
      </header>

      @if (roleProfileAnswerCount() > 0) {
        <aside class="dashboard-role-reading-note">
          <strong>{{ text('Cómo leer los porcentajes', 'How to read the percentages') }}</strong>
          <p>
            <b>{{ text('Afinidad media', 'Average affinity') }}:</b>
            {{ text(
              'cuánto te atraen los roles de ese tipo que ya has respondido. No mide progreso.',
              'how much the answered roles in that family appeal to you. It is not completion.'
            ) }}
            <b>{{ text('Presencia en tu perfil', 'Presence in your profile') }}:</b>
            {{ text(
              'qué parte de toda tu afinidad de roles cae en esa familia; Activo + Receptivo + Mutuo suman 100%.',
              'what share of your total role affinity belongs to that family; Active + Receptive + Mutual add up to 100%.'
            ) }}
          </p>
        </aside>

        <div class="dashboard-role-profile">
          @for (entry of roleProfile(); track entry.perspective) {
            <div class="dashboard-role-row" [class.dashboard-role-row-empty]="entry.answerCount === 0">
              <div class="dashboard-role-row-heading">
                <div>
                  <strong>{{ rolePerspectiveLabel(entry.perspective) }}</strong>
                  <small>{{ rolePerspectiveDescription(entry.perspective) }}</small>
                </div>
                <span>{{ roleEvidenceLabel(entry.answerCount) }}</span>
              </div>

              <div class="dashboard-role-metrics">
                <div class="dashboard-role-metric">
                  <div class="dashboard-role-metric-label">
                    <span>{{ text('Afinidad media', 'Average affinity') }}</span>
                    <strong>{{ entry.affinityPercentage }}% · {{ affinityDescriptor(entry.affinityPercentage) }}</strong>
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
                    <span>{{ text('Presencia en tu perfil', 'Presence in your profile') }}</span>
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
                <span>{{ text('Favoritos dentro de este rol', 'Favorites within this role') }}</span>
                <strong>{{ entry.favoritePercentage }}%</strong>
              </div>
            </div>
          }
        </div>

        <section class="dashboard-role-spectra" [attr.aria-label]="text('Tendencias de rol', 'Role tendencies')">
          <div class="dashboard-role-spectrum-block">
            <div class="dashboard-role-spectrum-heading">
              <div>
                <strong>{{ text('Activo ↔ Receptivo', 'Active ↔ Receptive') }}</strong>
                <small>{{ text(
                  'Compara la afinidad media de las dos familias direccionales. Mutuo se mantiene aparte porque no es el punto medio entre ambas.',
                  'Compares average affinity for the two directional families. Mutual stays separate because it is not the midpoint between them.'
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
              <strong class="dashboard-role-spectrum-diagnosis">{{ roleTrendDiagnosis() }}</strong>
            </div>
          </div>

          <div class="dashboard-role-spectrum-block dashboard-role-spectrum-initiative">
            <div class="dashboard-role-spectrum-heading">
              <div>
                <strong>{{ text('Preferencia de iniciativa', 'Initiative preference') }}</strong>
                <small>{{ text(
                  'Sólo utiliza respuestas en las que has indicado explícitamente quién prefieres que dé el primer paso.',
                  'Uses only answers where you explicitly stated who you prefer to make the first move.'
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
                <strong class="dashboard-role-spectrum-diagnosis">{{ initiativeTrendDiagnosis() }}</strong>
              </div>
            } @else {
              <p class="dashboard-role-initiative-empty">{{ text(
                'Aún no hay respuestas con preferencia de iniciativa. No mostramos una posición hasta tener datos reales.',
                'There are no answers with an initiative preference yet. No position is shown until there is real evidence.'
              ) }}</p>
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

  rolePerspectiveDescription(perspective: RolePerspective): string {
    if (perspective === 'active') {
      return this.text('Tú realizas, das o diriges la acción.', 'You perform, give, or direct the action.');
    }
    if (perspective === 'receptive') {
      return this.text('Tú recibes o eres el destinatario de la acción.', 'You receive or are the target of the action.');
    }
    return this.text('La práctica es compartida, recíproca o sin una dirección de rol.', 'The practice is shared, reciprocal, or has no directional role.');
  }

  roleEvidenceLabel(count: number): string {
    return this.text(
      `${count} ${count === 1 ? 'rol medido' : 'roles medidos'}`,
      `${count} measured ${count === 1 ? 'role' : 'roles'}`,
    );
  }

  affinityDescriptor(score: number): string {
    if (score < 20) return this.text('muy baja', 'very low');
    if (score < 40) return this.text('baja', 'low');
    if (score < 60) return this.text('media', 'medium');
    if (score < 80) return this.text('alta', 'high');
    return this.text('muy alta', 'very high');
  }

  roleCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().roleBalance);
  }

  initiativeCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().initiativeBalance);
  }

  roleDirectionEvidenceLabel(): string {
    const count = this.roleProfileCoordinates().roleEvidenceCount;
    return this.roleEvidenceLabel(count);
  }

  roleInitiativeEvidenceLabel(): string {
    const count = this.roleProfileCoordinates().initiativeEvidenceCount;
    return this.i18n.plural(
      count,
      'dashboard.roleProfile.initiativeEvidence.one',
      'dashboard.roleProfile.initiativeEvidence.other',
    );
  }

  roleTrendDiagnosis(): string {
    return this.balanceDiagnosis(
      this.roleProfileCoordinates().roleBalance,
      this.i18n.t('dashboard.roleProfile.receptive'),
      this.i18n.t('dashboard.roleProfile.active'),
    );
  }

  initiativeTrendDiagnosis(): string {
    return this.balanceDiagnosis(
      this.roleProfileCoordinates().initiativeBalance,
      this.i18n.t('dashboard.roleProfile.initiativePartner'),
      this.i18n.t('dashboard.roleProfile.initiativeSelf'),
    );
  }

  roleMetricAriaLabel(entry: RoleProfileEntry, metric: 'affinity' | 'weight'): string {
    const label = metric === 'affinity'
      ? this.text('Afinidad media', 'Average affinity')
      : this.text('Presencia en tu perfil', 'Presence in your profile');
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

  private balanceDiagnosis(value: number, low: string, high: string): string {
    const magnitude = Math.abs(value);
    if (magnitude < 10) return this.text('Muy equilibrado', 'Very balanced');
    const target = value < 0 ? low : high;
    if (magnitude < 25) return this.text(`Ligera tendencia hacia ${target}`, `Slight tendency toward ${target}`);
    if (magnitude < 50) return this.text(`Tendencia hacia ${target}`, `Tendency toward ${target}`);
    return this.text(`Tendencia clara hacia ${target}`, `Clear tendency toward ${target}`);
  }
}

function coordinateLeft(value: number): number {
  return Math.max(6, Math.min(94, 50 + value * 0.44));
}
