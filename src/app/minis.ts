import { Component, computed, inject } from '@angular/core';
import { CONC } from './data';
import { DeltaView } from './shared';
import { Ico } from './ico';
import { Store } from './store';
import { computeDelta, d1, hoje, mAvg, nf } from './util';

@Component({
  selector: 'app-minis',
  imports: [Ico, DeltaView],
  template: `<section class="panel mini gru" aria-label="Serviços com GRU">
      <div class="mini-h"><span class="ico-s"><app-ico n="layers" [s]="18" /></span>Serviços com GRUs</div>
      <strong>{{ nf(v().gru) }}</strong>
      <small>de 01/Janeiro à <em>{{ hoje }}</em></small>
      <app-delta [d]="v().dGru" />
      <svg class="shield" viewBox="0 0 240 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <path d="M18 150V66Q104 44 120 6Q136 44 222 66V150" fill="none" stroke="#ECEDEE" stroke-width="24" />
        <path d="M66 150Q108 138 120 112Q132 138 174 150Z" fill="#E0CDA9" />
      </svg>
    </section>
    <section class="panel mini" aria-label="Tempo médio de conclusão">
      <div class="mini-h"><span class="ico-s"><app-ico n="layers" [s]="18" /></span>Tempo médio de conclusão</div>
      <strong>{{ d1(v().avg) }} dias</strong>
      <small>manuais · {{ nf(v().man) }} processos</small>
      <app-delta [d]="v().dAvg" />
      <div class="spark2" role="img" aria-label="Tempo médio por mês (exemplo)">
        @for (s of spark; track s.m) {
          <div class="sp"><i [class.last]="s.last" [style.height.%]="s.h" [attr.title]="s.m + ': ' + s.v + ' dias'"></i><span>{{ s.m }}</span></div>
        }
      </div>
    </section>`,
})
export class Minis {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly d1 = d1;
  readonly hoje = hoje();
  /* Valores fixos de exemplo, apenas para ilustrar a variação de alturas. */
  readonly spark = (() => {
    const MJ = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const vals = [8, 22, 34, 18, 40, 30, 46, 26, 52, 38, 60, 44];
    return vals.map((v, i) => ({ m: MJ[i], v, h: (v / 60) * 100, last: i === 10 }));
  })();
  readonly v = computed(() => {
    const rs = this.store.sel(), base = this.store.sel('periodo');
    return {
      gru: rs.filter((r) => r.gru).length,
      man: rs.filter((r) => CONC.has(r.st) && !r.auto).length,
      avg: mAvg(rs),
      dGru: computeDelta(base, (r) => r.gru, null, false),
      dAvg: computeDelta(base, () => true, mAvg, true),
    };
  });
}
