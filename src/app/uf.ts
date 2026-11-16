import { Component, computed, inject } from '@angular/core';
import { GRID, UFS } from './data';
import { Store } from './store';
import { d1, nf, sum } from './util';

@Component({
  selector: 'app-uf',
  template: `<section class="panel card" aria-label="Processos por UF">
    <div class="card-h"><div><h3>Processos por UF</h3><small>Distribuição no Brasil · destaque para os estados acima da média</small></div></div>
    <div class="uf">
      <div class="tiles" role="group" aria-label="Mapa de UFs">
        @for (t of v().tiles; track $index) {
          @if (t.u) {
            <button class="tile" [class]="'tile ' + t.cls" (click)="store.toggleF('uf', t.u)" [attr.aria-pressed]="store.f().uf === t.u" [attr.aria-label]="t.u + ': ' + t.n + ' processos'" [attr.title]="t.u + ': ' + t.n">{{ t.u }}<small>{{ t.n }}</small></button>
          } @else {
            <span class="tile empty"></span>
          }
        }
      </div>
      <div>
        <div class="ufstats">
          <div><small>TOTAL DE PROCESSOS</small><strong>{{ nf(v().total) }}</strong></div>
          <div><small>MÉDIA POR UF</small><strong>{{ d1(v().av) }}</strong></div>
        </div>
        <p class="sub" style="margin: var(--s2) 0 0"><b style="color: var(--content)">Totais por UF</b> · {{ v().acima }} UFs acima da média</p>
        <div class="uflist">
          @for (u of v().sorted; track u.u) {
            <button class="ufrow" (click)="store.toggleF('uf', u.u)" [attr.aria-pressed]="store.f().uf === u.u"><i class="dot" [class]="'dot ' + u.cls"></i>{{ u.u }}<b>{{ u.n }}</b></button>
          }
        </div>
        <p class="sub">Média = total de processos ÷ 27 UFs.</p>
      </div>
    </div>
    <div class="ufleg"><span><i class="dot"></i>Até a média</span><span><i class="dot m1"></i>Acima da média</span><span><i class="dot m2"></i>Mais de 2× a média</span></div>
  </section>`,
})
export class UfMap {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly d1 = d1;
  readonly v = computed(() => {
    const rs = this.store.sel('uf'), cnt: Record<string, number> = {};
    UFS.forEach((u) => (cnt[u] = 0));
    rs.forEach((r) => cnt[r.uf]++);
    const total = sum(Object.values(cnt)), av = total / 27;
    const cls = (v: number) => (v >= 2 * av ? 'm2' : v > av ? 'm1' : '');
    const tiles: { u: string; n: number; cls: string }[] = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const u = UFS.find((k) => GRID[k][0] === r && GRID[k][1] === c);
        tiles.push(u ? { u, n: cnt[u], cls: cls(cnt[u]) } : { u: '', n: 0, cls: '' });
      }
    const sorted = [...UFS].sort((a, b) => cnt[b] - cnt[a]).map((u) => ({ u, n: cnt[u], cls: cls(cnt[u]) }));
    return { total, av, tiles, sorted, acima: UFS.filter((u) => cnt[u] > av).length };
  });
}
