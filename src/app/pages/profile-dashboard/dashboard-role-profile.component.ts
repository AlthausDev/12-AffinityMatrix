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
            'Ordena tus respuestas según el lugar que ocupas en la acción: hacerla, recibirla o compartirla de forma recíproca.',
            'Organizes your answers by the place you occupy in the action: doing it, receiving it, or sharing it reciprocally.'
          ) }}</p>
        </div>
      </header>

      @if (roleProfileAnswerCount() > 0) {
        <aside class="dashboard-role-reading-note">
          <div class="dashboard-role-reading-heading">
            <strong>{{ text('Cómo leer estos números', 'How to read these numbers') }}</strong>
            <small>{{ text(
              'Hay tres medidas distintas. Ninguna indica cuánto cuestionario has completado.',
              'There are three different measures. None of them indicates questionnaire completion.'
            ) }}</small>
          </div>

          <div class="dashboard-role-reading-grid">
            <div>
              <strong>{{ text('Afinidad media', 'Average affinity') }}</strong>
              <p>{{ text(
                'Resume cuánto te atraen, de media, los roles ya respondidos de esa familia. 0% equivale a respuestas sin afinidad positiva; 100% equivaldría a haberlos marcado todos como Favorito. Activo, Receptivo y Mutuo no tienen por qué sumar 100 aquí.',
                'Summarizes how appealing the answered roles in that family are on average. 0% means no positive affinity; 100% would mean every one was marked Favorite. Active, Receptive, and Mutual do not need to add up to 100 here.'
              ) }}</p>
            </div>
            <div>
              <strong>{{ text('Peso relativo', 'Relative weight') }}</strong>
              <p>{{ text(
                'Reparte toda la afinidad de rol detectada entre las tres familias. Aquí sí: Activo + Receptivo + Mutuo = 100%. Un 39% Activo significa que el 39% del peso de afinidad de rol medido procede de respuestas activas; no que «seas 39% activo».',
                'Splits all detected role affinity between the three families. Here Active + Receptive + Mutual = 100%. A 39% Active weight means 39% of the measured role-affinity weight comes from active answers; it does not mean you are “39% active”.'
              ) }}</p>
            </div>
            <div>
              <strong>{{ text('Favoritos', 'Favorites') }}</strong>
              <p>{{ text(
                'Indica qué porcentaje de los roles medidos dentro de esa familia marcaste como Favorito. Es una señal de intensidad, independiente del reparto de peso relativo.',
                'Shows what percentage of measured roles inside that family you marked Favorite. It is an intensity signal, separate from the relative-weight split.'
              ) }}</p>
            </div>
          </div>
        </aside>

        <aside class="dashboard-role-summary">
          <span>{{ text('Lectura rápida', 'Quick read') }}</span>
          <strong>{{ roleProfileDiagnosis() }}</strong>
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
                  <div class="dashboard-role-track" role="img" [attr.aria-label]="roleMetricAriaLabel(entry, 'affinity')">
                    <span class="dashboard-role-fill dashboard-role-fill-affinity" [style.width.%]="entry.affinityPercentage"></span>
                  </div>
                </div>

                <div class="dashboard-role-metric">
                  <div class="dashboard-role-metric-label">
                    <span>{{ text('Peso relativo', 'Relative weight') }}</span>
                    <strong>{{ entry.profileWeightPercentage }}%</strong>
                  </div>
                  <div class="dashboard-role-track" role="img" [attr.aria-label]="roleMetricAriaLabel(entry, 'weight')">
                    <span class="dashboard-role-fill dashboard-role-fill-weight" [style.width.%]="entry.profileWeightPercentage"></span>
                  </div>
                </div>
              </div>

              <div class="dashboard-role-row-meta">
                <span>{{ text('Favoritos en esta familia', 'Favorites in this family') }}</span>
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
                  'Compara sólo las dos familias direccionales. Mutuo queda fuera porque compartir una práctica no es un punto medio matemático entre hacerla y recibirla.',
                  'Compares only the two directional families. Mutual stays out because sharing a practice is not a mathematical midpoint between doing it and receiving it.'
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
                <span class="dashboard-role-spectrum-marker" [style.left.%]="roleCoordinateLeft()" aria-hidden="true"></span>
              </div>
              <strong class="dashboard-role-spectrum-diagnosis">{{ roleTrendDiagnosis() }}</strong>
            </div>
          </div>

          <div class="dashboard-role-spectrum-block dashboard-role-spectrum-initiative">
            <div class="dashboard-role-spectrum-heading">
              <div>
                <strong>{{ text('Preferencia de iniciativa', 'Initiative preference') }}</strong>
                <small>{{ text(
                  'Sólo usa respuestas donde has indicado explícitamente quién prefieres que dé el primer paso.',
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
                  <span class="dashboard-role-spectrum-marker dashboard-role-spectrum-marker-initiative" [style.left.%]="initiativeCoordinateLeft()" aria-hidden="true"></span>
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
      return this.text('Roles donde tú haces, das, aplicas o diriges la acción.', 'Roles where you do, give, apply, or direct the action.');
    }
    if (perspective === 'receptive') {
      return this.text('Roles donde tú recibes o eres el destinatario de la acción.', 'Roles where you receive or are the target of the action.');
    }
    return this.text('Prácticas compartidas, recíprocas o sin una dirección activo/receptivo.', 'Shared or reciprocal practices, or ones without an active/receptive direction.');
  }

  roleEvidenceLabel(count: number): string {
    return this.text(
      `${count} ${count === 1 ? 'rol medido' : 'roles medidos'}`,
      `${count} measured ${count === 1 ? 'role' : 'roles'}`,
    );
  }

  affinityDescriptor(score: number): string {
    if (score < 15) return this.text('muy baja', 'very low');
    if (score < 32) return this.text('baja', 'low');
    if (score < 44) return this.text('condicional', 'conditional');
    if (score < 58) return this.text('curiosidad / mixta', 'curious / mixed');
    if (score < 70) return this.text('positiva', 'positive');
    if (score < 88) return this.text('alta', 'high');
    return this.text('muy alta', 'very high');
  }

  roleProfileDiagnosis(): string {
    const entries = this.roleProfile();
    const active = entries.find((entry) => entry.perspective === 'active')?.profileWeightPercentage ?? 0;
    const receptive = entries.find((entry) => entry.perspective === 'receptive')?.profileWeightPercentage ?? 0;
    const mutual = entries.find((entry) => entry.perspective === 'neutral')?.profileWeightPercentage ?? 0;
    const weights = [
      { perspective: 'active' as const, value: active },
      { perspective: 'receptive' as const, value: receptive },
      { perspective: 'neutral' as const, value: mutual },
    ].sort((a, b) => b.value - a.value);
    const dominant = weights[0];
    const second = weights[1];
    const spread = (dominant?.value ?? 0) - (weights.at(-1)?.value ?? 0);
    const lead = (dominant?.value ?? 0) - (second?.value ?? 0);
    const versatile = Math.min(active, receptive, mutual) >= 18 && spread <= 30;
    const balance = this.roleProfileCoordinates().roleBalance;
    const direction = this.directionalSuffix(balance);

    if (versatile) {
      const dominantLabel = dominant && lead >= 8 ? this.roleProfileFamilyPhrase(dominant.perspective) : '';
      if (dominantLabel && direction) {
        return this.text(
          `Perfil bastante versátil: las tres formas de participación tienen peso, aunque destaca ${dominantLabel} y aparece ${direction}.`,
          `Quite a versatile profile: all three forms of participation carry weight, although ${dominantLabel} stands out and there is ${direction}.`,
        );
      }
      if (dominantLabel) {
        return this.text(
          `Perfil bastante versátil: las tres formas de participación tienen peso, con algo más de presencia ${dominantLabel}.`,
          `Quite a versatile profile: all three forms of participation carry weight, with somewhat more presence ${dominantLabel}.`,
        );
      }
      return this.text(
        'Perfil de roles muy equilibrado: activo, receptivo y mutuo tienen un peso parecido y ninguno domina con claridad.',
        'Very balanced role profile: active, receptive, and mutual carry similar weight and none clearly dominates.',
      );
    }

    if (!dominant || lead < 8) {
      return direction
        ? this.text(`Perfil mixto y bastante repartido, con ${direction}.`, `Mixed and fairly distributed profile, with ${direction}.`)
        : this.text('Perfil mixto y bastante repartido entre las tres familias.', 'Mixed profile, fairly distributed across the three families.');
    }

    const dominantLabel = this.roleProfileFamilyPhrase(dominant.perspective);
    if (dominant.perspective === 'neutral') {
      return direction
        ? this.text(`Predominan las respuestas ${dominantLabel}, con ${direction}.`, `Answers ${dominantLabel} predominate, with ${direction}.`)
        : this.text(`Predominan las respuestas ${dominantLabel}.`, `Answers ${dominantLabel} predominate.`);
    }

    const marked = lead >= 20 || dominant.value >= 50;
    return marked
      ? this.text(`Hay un predominio claro ${dominantLabel}.`, `There is a clear predominance ${dominantLabel}.`)
      : this.text(`Hay una ligera mayor presencia ${dominantLabel}.`, `There is a slightly greater presence ${dominantLabel}.`);
  }

  roleCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().roleBalance);
  }

  initiativeCoordinateLeft(): number {
    return coordinateLeft(this.roleProfileCoordinates().initiativeBalance);
  }

  roleDirectionEvidenceLabel(): string {
    return this.roleEvidenceLabel(this.roleProfileCoordinates().roleEvidenceCount);
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
      : this.text('Peso relativo', 'Relative weight');
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

  private roleProfileFamilyPhrase(perspective: RolePerspective): string {
    if (perspective === 'active') return this.text('de lo activo', 'of active roles');
    if (perspective === 'receptive') return this.text('de lo receptivo', 'of receptive roles');
    return this.text('de lo mutuo/recíproco', 'of mutual/reciprocal roles');
  }

  private directionalSuffix(value: number): string {
    const magnitude = Math.abs(value);
    if (magnitude < 10) return '';
    const target = value < 0
      ? this.text('una ligera inclinación receptiva', 'a slight receptive lean')
      : this.text('una ligera inclinación activa', 'a slight active lean');
    if (magnitude < 30) return target;
    return value < 0
      ? this.text('una inclinación receptiva clara', 'a clear receptive lean')
      : this.text('una inclinación activa clara', 'a clear active lean');
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
