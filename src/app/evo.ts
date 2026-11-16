import { Component, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { CONC, MONTHS } from './data';
import { Store } from './store';
import { niceStep, sum } from './util';

@Component({
  selector: 'app-evo',
  template: `<section class="panel card evo">
    <div class="card-h">
      <div><h3>Evolução mensal</h3><small>Processos por mês de criação</small></div>
      <div class="seg" style="margin: 0" role="group" aria-label="Visão">
        <button (click)="store.evo.set('macro')" [attr.aria-pressed]="store.evo() === 'macro'">Macro</button>
        <button (click)="store.evo.set('op')" [attr.aria-pressed]="store.evo() === 'op'">Operacional</button>
      </div>
    </div>
    <svg [attr.viewBox]="'0 0 ' + g().W + ' ' + g().H" role="img" aria-label="Evolução mensal de processos" style="width: 100%; height: auto">
      @for (l of g().lines; track l.v) {
        <line [attr.x1]="g().L" [attr.x2]="g().W" [attr.y1]="l.y" [attr.y2]="l.y" stroke="#ECEDEE" [attr.stroke-dasharray]="l.v ? '3 3' : null" />
        <text [attr.x]="g().L - 8" [attr.y]="l.y + 4" text-anchor="end" font-size="11" fill="#6A6D7C">{{ l.v }}</text>
      }
      @for (c of g().cols; track c.label) {
        <g tabindex="0" [attr.aria-label]="c.aria">
          <title>{{ c.tip }}</title>
          <rect [attr.x]="c.x0" [attr.y]="g().T" [attr.width]="g().cw" [attr.height]="g().ph" fill="transparent" />
          @for (p of c.parts; track $index) {
            <rect [attr.x]="c.x" [attr.y]="p.y" [attr.width]="g().bw" [attr.height]="p.h" [attr.fill]="p.fill" rx="2" />
          }
        </g>
        <text [attr.x]="c.x + g().bw / 2" [attr.y]="g().H - 10" text-anchor="middle" font-size="11" fill="#555868">{{ c.label }}</text>
      }
    </svg>
    <div class="legend">
      @for (s of g().series; track s[0]) {
        <span><i [style.background]="s[1]"></i>{{ s[0] }}</span>
      }
    </div>
  </section>`,
})
export class Evo {
  readonly store = inject(Store);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cw = signal(0);
  private readonly iw = signal(typeof window === 'undefined' ? 1400 : window.innerWidth);

  constructor() {
    afterNextRender(() => {
      const sec = this.el.nativeElement.querySelector('section') as HTMLElement;
      const upd = () => {
        this.iw.set(window.innerWidth);
        this.cw.set(Math.round(sec.clientWidth - 2 * parseFloat(getComputedStyle(sec).paddingLeft)));
      };
      new ResizeObserver(upd).observe(sec);
      upd();
    });
  }

  readonly g = computed(() => {
    const rs = this.store.sel(), f = this.store.f();
    const W = Math.max(320, this.cw() || 640), H = this.iw() > 1200 ? 190 : 270, L = 40, B = 30, T = 10, pw = W - L, ph = H - B - T;
    const series: [string, string][] = this.store.evo() === 'macro' ? [['Concluídos', '#4A7DC9'], ['Ativos', '#E0CDA9']] : [['Automáticos', '#A1C6ED'], ['Manuais', '#4A7DC9'], ['Ativos', '#E0CDA9']];
    const macro = this.store.evo() === 'macro';
    const cat = (r: { st: string; auto: boolean }) => (macro ? (CONC.has(r.st) ? 'Concluídos' : 'Ativos') : !CONC.has(r.st) ? 'Ativos' : r.auto ? 'Automáticos' : 'Manuais');
    const idx = MONTHS.map((_, i) => i).filter((i) => i >= 12 - +f.periodo);
    const cols = idx.map((i) => {
      const o: Record<string, number> = {};
      series.forEach((s) => (o[s[0]] = 0));
      rs.filter((r) => r.m === i).forEach((r) => o[cat(r)]++);
      return o;
    });
    const mx = Math.max(1, ...cols.map((o) => sum(Object.values(o))));
    const step = niceStep(mx / 4), top = Math.ceil(mx / step) * step, n = idx.length, cw = pw / n, bw = cw * 0.62;
    const lines: { v: number; y: number }[] = [];
    for (let v = 0; v <= top; v += step) lines.push({ v, y: T + ph - (v / top) * ph });
    const out = cols.map((o, k) => {
      let y = T + ph;
      const x = L + k * cw + (cw - bw) / 2;
      const parts = series.map((s) => {
        const h = (o[s[0]] / top) * ph;
        y -= h;
        return { y, h, fill: s[1] };
      }).filter((p) => p.h > 0);
      return {
        x0: L + k * cw, x, parts, label: MONTHS[idx[k]],
        aria: `${MONTHS[idx[k]]}: ${series.map((s) => s[0] + ' ' + o[s[0]]).join(', ')}`,
        tip: `${MONTHS[idx[k]]}: ${series.map((s) => s[0] + ' ' + o[s[0]]).join(' · ')}`,
      };
    });
    return { W, H, L, T, ph, cw, bw, lines, cols: out, series };
  });
}
