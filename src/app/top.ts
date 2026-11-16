import { Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ALL, ServiceInfo } from './data';
import { Ico } from './ico';
import { Store } from './store';
import { d1, nf } from './util';

interface Card extends ServiceInfo { cur: number; prev: number; c: string; has: boolean; up: boolean; pct: string }

@Component({
  selector: 'app-top',
  imports: [RouterLink, Ico, NgTemplateOutlet],
  template: `<section class="panel card allsvc" aria-labelledby="top-t">
    <div class="card-h">
      <div><h3 id="top-t">Serviços mais demandados {{ store.f().tema ? 'de ' + store.f().tema : 'do Mês' }}</h3></div>
      @if (v().rest.length) {
        <button class="acc-btn" (click)="toggle()" [attr.aria-expanded]="store.topAll()" aria-controls="top-acc">
          <span class="lbl">{{ store.topAll() ? 'Ver menos' : 'Ver todos os serviços' }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 9l7 7 7-7" /></svg>
        </button>
      }
    </div>
    <div class="cards4">
      @for (r of v().top; track r.nome) {
        <ng-container *ngTemplateOutlet="card; context: { r: r }" />
      }
    </div>
    @if (v().rest.length) {
      <div class="acc" [class.open]="store.topAll()" id="top-acc">
        <div>
          <h4 class="grp">Demais serviços ({{ v().rest.length }})</h4>
          <div class="cards4">
            @for (r of v().rest; track r.nome) {
              <ng-container *ngTemplateOutlet="card; context: { r: r }" />
            }
          </div>
        </div>
      </div>
    }
  </section>
  <ng-template #card let-r="r">
    <a class="scard" [style.--c]="r.c" [routerLink]="[]" [queryParams]="{ tema: r.t, servico: r.nome }" [attr.aria-label]="'Abrir página de ' + r.nome">
      <span class="scard-h"><span class="ico-s"><app-ico [n]="r.icon" [s]="20" /></span><span class="st">{{ r.nome + (r.sigla ? ' ' : '') }}@if (r.sigla) {<span>({{ r.sigla }})</span>}</span></span>
      <strong>{{ nf(r.cur) }}</strong>
      @if (r.has) {
        <span class="delta" [class.up]="r.up" [class.down]="!r.up"><b aria-hidden="true">{{ r.up ? '↑' : '↓' }}</b> {{ r.pct }}% <span class="vs">em relação ao mês anterior</span></span>
      } @else {
        <span class="delta"><span class="vs">Sem base no mês anterior</span></span>
      }
    </a>
  </ng-template>`,
})
export class Top {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly v = computed(() => {
    const rs = this.store.sel('servico'), tema = this.store.f().tema;
    const cur: Record<string, number> = {}, prev: Record<string, number> = {};
    rs.forEach((r) => {
      if (r.m === 11) cur[r.s] = (cur[r.s] || 0) + 1;
      else if (r.m === 10) prev[r.s] = (prev[r.s] || 0) + 1;
    });
    const all = ALL.filter((x) => !tema || x.t === tema).map((x) => ({ ...x, cur: cur[x.nome] || 0, prev: prev[x.nome] || 0 })).sort((a, b) => b.cur - a.cur);
    /* degradê do primeiro ao último card: #E4CCAA -> #C8B292 */
    const A = [0xe4, 0xcc, 0xaa], Z = [0xc8, 0xb2, 0x92];
    const col = (i: number, n: number) => {
      const t = n > 1 ? i / (n - 1) : 0;
      return '#' + A.map((v, k) => Math.round(v + (Z[k] - v) * t).toString(16).padStart(2, '0')).join('');
    };
    const mk = (l: typeof all): Card[] => l.map((r, i) => {
      const has = r.prev > 0, p = has ? ((r.cur - r.prev) / r.prev) * 100 : 0;
      return { ...r, c: col(i, l.length), has, up: p >= 0, pct: d1(Math.abs(p)) };
    });
    return { top: mk(all.slice(0, 8)), rest: mk(all.slice(8)) };
  });
  toggle() {
    this.store.topAll.set(!this.store.topAll());
    if (this.store.topAll()) setTimeout(() => document.getElementById('top-acc')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }
}
