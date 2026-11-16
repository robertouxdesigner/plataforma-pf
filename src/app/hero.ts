import { Component, computed, inject } from '@angular/core';
import { CONC, MONTHS } from './data';
import { Store } from './store';
import { cap, d1, nf } from './util';

@Component({
  selector: 'app-hero',
  template: `<section class="hero2" aria-label="Balanço do período">
    <svg class="h2-shield" viewBox="0 0 240 170" aria-hidden="true" focusable="false">
      <path d="M0 170V64L120 0L240 64V170Z" fill="rgba(255,255,255,.05)" />
      <path d="M36 170V86L120 40L204 86V170Z" fill="rgba(0,0,0,.08)" />
      <path d="M84 170V120L120 92L156 120V170Z" fill="rgba(255,255,255,.07)" />
    </svg>
    <div class="h2-head">
      <div class="h2-t">
        <h2>Total a concluir<span aria-hidden="true">→</span>concluído</h2>
        <select class="h2-sel" aria-label="Mês do balanço" (change)="store.setF('heroM', $any($event.target).value)">
          <option value="" [selected]="store.f().heroM === ''">Todos</option>
          @for (m of months; track m.v) {
            <option [value]="m.v" [selected]="store.f().heroM === m.v">{{ m.t }}</option>
          }
        </select>
      </div>
      <p>Comparação direta entre a demanda em andamento e os processos finalizados.</p>
    </div>
    <div class="h2-body">
      <div class="h2-rate" [attr.aria-label]="'Taxa de conclusão ' + d1(v().rate) + ' por cento'">{{ d1(v().rate) }}/<span>100%</span></div>
      <div class="h2-b">
        <div><small>Total a concluir</small><strong>{{ nf(v().at) }}</strong><em>{{ nf(v().over) }} acima de 60 dias</em></div>
        <span class="arr" aria-hidden="true">→</span>
        <div><small>Concluído</small><strong>{{ nf(v().co) }}</strong><em>{{ nf(v().co - v().auto) }} manuais · {{ nf(v().auto) }} automáticos</em></div>
      </div>
    </div>
    <div class="h2-chart">
      <div class="h2-leg">
        <span class="c1">Criados · {{ v().n ? '100,0' : '0,0' }}%</span>
        <span class="c2">Concluídos · {{ d1(v().rate) }}%</span>
      </div>
      <svg viewBox="0 0 320 96" role="img" aria-label="Processos criados e concluídos por mês" preserveAspectRatio="none">
        <polyline [attr.points]="v().crt" fill="none" stroke="#A1C6ED" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        <polyline [attr.points]="v().cnc" fill="none" stroke="#FFF3B0" stroke-width="2" vector-effect="non-scaling-stroke" />
      </svg>
    </div>
  </section>`,
})
export class Hero {
  readonly store = inject(Store);
  readonly d1 = d1;
  readonly nf = nf;
  readonly months = MONTHS.map((m, i) => ({ v: String(i), t: cap(m) }));
  readonly v = computed(() => {
    const rs = this.store.sel(), f = this.store.f(), hm = f.heroM;
    const rh = hm === '' ? rs : rs.filter((r) => r.m === +hm);
    const at = rh.filter((r) => !CONC.has(r.st)), co = rh.filter((r) => CONC.has(r.st));
    const auto = co.filter((r) => r.auto).length;
    const rate = rh.length ? (co.length / rh.length) * 100 : 0;
    const over = at.filter((r) => (r.age ?? 0) > 60).length;
    const idx = MONTHS.map((_, i) => i).filter((i) => i >= 12 - +f.periodo);
    const crt = idx.map((i) => rs.filter((r) => r.m === i).length);
    const cnc = idx.map((i) => rs.filter((r) => r.m === i && CONC.has(r.st)).length);
    const W = 320, H = 96, all = [...crt, ...cnc], mn = Math.min(...all), mx = Math.max(...all), rg = Math.max(1, mx - mn);
    const line = (a: number[]) => a.map((x, k) => `${((k / Math.max(1, a.length - 1)) * (W - 8) + 4).toFixed(1)},${(H - 8 - ((x - mn) / rg) * (H - 16)).toFixed(1)}`).join(' ');
    return { rate, at: at.length, co: co.length, auto, over, n: rh.length, crt: line(crt), cnc: line(cnc) };
  });
}
