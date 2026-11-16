import { Component, computed, inject } from '@angular/core';
import { DeltaView } from './shared';
import { Ico } from './ico';
import { Store } from './store';
import { computeDelta, nf } from './util';

@Component({
  selector: 'app-kpis',
  imports: [Ico, DeltaView],
  template: `<div class="grid kpis">
    @for (k of list(); track k.st) {
      <button class="kpi" [class.neg]="k.neg && k.st === 'Indeferido'" (click)="store.toggleF('status', k.st)" [attr.aria-pressed]="store.f().status === k.st">
        <div class="kpi-h"><span class="ico-s"><app-ico n="layers" [s]="18" /></span>{{ k.lb }}</div>
        <div class="kpi-b"><strong>{{ nf(k.n) }}</strong><app-delta [d]="k.delta" /></div>
      </button>
    }
  </div>`,
})
export class Kpis {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly list = computed(() => {
    const rs = this.store.sel('status'), base = this.store.sel('periodo');
    const defs: [string, string, boolean][] = [['Tramitação automática', 'Tramitação automática', false], ['Em análise', 'Em análise', false], ['Deferido', 'Deferido', false], ['Indeferido', 'Indeferido', true], ['Restituído arquivado', 'Restituídos arquivados', true]];
    return defs.map(([st, lb, neg]) => ({ st, lb, neg, n: rs.filter((r) => r.st === st).length, delta: computeDelta(base, (r) => r.st === st, null, neg) }));
  });
}
