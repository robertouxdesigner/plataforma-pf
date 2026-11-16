import { Component, computed, inject } from '@angular/core';
import { CONC, DATA, DMAX, MONTHS, THEMES } from './data';
import { Hero } from './hero';
import { Ico } from './ico';
import { Store } from './store';
import { Top } from './top';
import { Attn } from './attn';
import { QClass, avg, d1, nf, qClass, qText, sum } from './util';

@Component({
  selector: 'app-theme',
  imports: [Hero, Ico, Top, Attn],
  template: `<section class="panel theme-card" [attr.aria-label]="'Serviços de ' + tema()">
      <div class="theme-h">
        <span class="theme-ico" aria-hidden="true">{{ th().abbr }}</span><strong>{{ tema() }}</strong>
        <span class="theme-t">Selecione um tipo de serviço para visualização de dados.</span>
        <button class="x-btn" (click)="store.collapsed.set(!store.collapsed())" [attr.aria-expanded]="!store.collapsed()" [attr.aria-label]="(store.collapsed() ? 'Expandir' : 'Recolher') + ' serviços'" [attr.title]="store.collapsed() ? 'Expandir' : 'Recolher'">
          <app-ico [n]="store.collapsed() ? 'chevron' : 'x'" [s]="store.collapsed() ? 16 : 14" [w]="3" />
        </button>
      </div>
      @if (!store.collapsed()) {
        <h4>Serviços</h4>
        <div class="svcs">
          <button class="svc" (click)="toggleAll()" [attr.aria-pressed]="store.allView()"><b><app-ico n="grid" [s]="20" /></b>Todos os Serviços</button>
          @for (s of th().svc; track s[0]) {
            <button class="svc" (click)="store.toggleF('servico', s[1])" [attr.aria-pressed]="store.f().servico === s[1]"><b>{{ s[0] }}</b>{{ s[1] }}</button>
          }
        </div>
      }
    </section>
    @if (store.f().servico) {
      <div class="svc-hero"><app-hero /></div>
    }
    @if (store.allView()) {
      <div class="daily-grid">
        <section class="panel card" aria-label="Taxa diária de conclusão">
          <div class="card-h"><div><h3 style="font-size: 16px; line-height: 24px; font-weight: 500">Taxa diária de conclusão · {{ mes }}</h3>
            <small>Mês atual · concluídos ÷ criados em cada dia (dias 1 a {{ days }}) · linha tracejada = taxa do mês ({{ d1(daily().tr) }}%)</small></div></div>
          <svg [attr.viewBox]="'0 0 ' + daily().W + ' ' + daily().H" role="img" [attr.aria-label]="'Taxa diária de conclusão em ' + mes" style="width: 100%; height: auto">
            @for (l of daily().grid; track l.v) {
              <line [attr.x1]="daily().L" [attr.x2]="daily().W" [attr.y1]="l.y" [attr.y2]="l.y" stroke="#ECEDEE" [attr.stroke-dasharray]="l.v ? '3 3' : null" />
              <text [attr.x]="daily().L - 8" [attr.y]="l.y + 4" text-anchor="end" font-size="11" fill="#6A6D7C">{{ l.v }}%</text>
            }
            @for (r of daily().rows; track r.d) {
              <g tabindex="0" [attr.aria-label]="r.aria"><title>{{ r.tip }}</title>
                <rect [attr.x]="r.x0" [attr.y]="daily().T" [attr.width]="daily().cw" [attr.height]="daily().ph" fill="transparent" />
                <rect [attr.x]="r.x" [attr.y]="r.y" [attr.width]="daily().bw" [attr.height]="r.h" rx="2" fill="#4A7DC9" />
                @if (r.rate != null && daily().cw >= 26) {
                  <text [attr.x]="r.x + daily().bw / 2" [attr.y]="r.y - 4" text-anchor="middle" font-size="10" fill="#555868">{{ nf(r.rate) }}</text>
                }
              </g>
              <text [attr.x]="r.x + daily().bw / 2" [attr.y]="daily().H - 8" text-anchor="middle" font-size="11" fill="#555868">{{ r.d }}</text>
            }
            <line [attr.x1]="daily().L" [attr.x2]="daily().W" [attr.y1]="daily().ya" [attr.y2]="daily().ya" stroke="#C19515" stroke-width="1.5" stroke-dasharray="5 4" />
          </svg>
        </section>
        <section class="panel card" aria-label="Tabela diária">
          <div class="card-h"><div><h3 style="font-size: 16px; line-height: 24px; font-weight: 500">Dados por dia · {{ mes }}</h3><small>Todos os serviços{{ store.f().tema ? ' de ' + store.f().tema : '' }}</small></div></div>
          @if (daily().tn) {
            <div class="tw"><table>
              <thead><tr><th>Dia</th><th class="num">Criados</th><th class="num">Concluídos</th><th class="num">Ativos</th><th class="num">Taxa</th></tr></thead>
              <tbody>
                @for (r of daily().rows; track r.d) {
                  <tr><td>{{ r.dia }}/{{ mes.slice(0, 3) }}</td><td class="num">{{ r.n }}</td><td class="num">{{ r.co }}</td><td class="num">{{ r.at }}</td><td class="num"><b>{{ r.rate == null ? '—' : d1(r.rate) + '%' }}</b></td></tr>
                }
              </tbody>
              <tfoot><tr><td>Total</td><td class="num">{{ nf(daily().tn) }}</td><td class="num">{{ nf(daily().tc) }}</td><td class="num">{{ nf(daily().tn - daily().tc) }}</td><td class="num">{{ d1(daily().tr) }}%</td></tr></tfoot>
            </table></div>
          } @else {
            <div class="empty-state">Nenhum processo no mês atual para os filtros selecionados.</div>
          }
        </section>
      </div>
    } @else {
      <div class="grid theme-grid">
        <section class="panel card">
          <div class="card-h"><div><h3 style="font-size: 16px; line-height: 24px; font-weight: 500">Q – Tempo médio de análise</h3><small>Q = (dias médios × 8) ÷ 60 · menor é melhor</small></div></div>
          @if (q().has) {
            <div class="gauge">
              <svg width="160" height="90" viewBox="0 0 160 90" role="img" [attr.aria-label]="'Q igual a ' + d1(q().q) + ', ' + qText[q().cls]">
                <path d="M16 80A64 64 0 0 1 144 80" fill="none" stroke="#ECEDEE" stroke-width="14" stroke-linecap="round" pathLength="100" />
                <path d="M16 80A64 64 0 0 1 144 80" fill="none" [attr.stroke]="q().color" stroke-width="14" stroke-linecap="round" pathLength="100" [attr.stroke-dasharray]="q().pct + ' 100'" />
              </svg>
              <div class="gauge-v"><strong>{{ d1(q().q) }}</strong><small>{{ d1((q().q * 60) / 8) }} dias médios</small></div>
              <span class="pill" [class]="'pill ' + q().cls">{{ qText[q().cls] }}</span>
              <div class="gscale">
                <span style="color: var(--pf-green-700)">≤ 6<b>Dentro</b></span><span style="color: var(--pf-gold-700)">≤ 8<b>Próximo</b></span><span style="color: var(--pf-red-600)">&gt; 8<b>Fora</b></span>
              </div>
            </div>
          } @else {
            <div class="empty-state">Sem processos concluídos manualmente.</div>
          }
        </section>
        <section class="panel card">
          <div class="card-h"><div><h3 style="font-size: 16px; line-height: 24px; font-weight: 500">Quantidade por unidade</h3><small>Ordene as colunas para comparar · clique em uma linha para filtrar</small></div></div>
          @if (units().length) {
            <div class="tw"><table>
              <thead><tr>
                @for (c of cols; track c.k) {
                  <th [class]="c.cls" [attr.aria-sort]="ariaSort(c.k)"><button (click)="sortBy(c.k)">{{ c.lb }} <span aria-hidden="true">{{ arrow(c.k) }}</span></button></th>
                }
                <th>Situação</th>
              </tr></thead>
              <tbody>
                @for (r of units(); track r.u) {
                  <tr [class.sel]="store.f().unidade === r.u">
                    <td><button class="link" style="font-size: 14px; color: inherit; text-decoration: none; font-weight: 500" (click)="store.toggleF('unidade', r.u)" [attr.aria-pressed]="store.f().unidade === r.u">{{ r.u }}</button></td>
                    <td class="num">{{ r.concl }}</td><td class="num">{{ d1(r.dias) }}</td><td class="num"><b>{{ d1(r.q) }}</b></td>
                    <td><span class="pill" [class]="'pill ' + r.cls">{{ qText[r.cls] }}</span></td>
                  </tr>
                }
              </tbody>
            </table></div>
          } @else {
            <div class="empty-state">Nenhuma unidade para os filtros selecionados.</div>
          }
        </section>
      </div>
      <app-top />
      <app-attn />
    }`,
})
export class ThemeView {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly d1 = d1;
  readonly qText = qText;
  readonly mes = MONTHS[11];
  readonly days = DMAX;
  readonly cols = [{ k: 'u', lb: 'Unidade', cls: '' }, { k: 'concl', lb: 'Concluídos', cls: 'num' }, { k: 'dias', lb: 'Dias médios', cls: 'num' }, { k: 'q', lb: 'Q', cls: 'num' }];
  readonly tema = computed(() => this.store.f().tema);
  readonly th = computed(() => THEMES[this.tema()]);

  toggleAll() {
    this.store.allView.set(!this.store.allView());
    if (this.store.allView()) this.store.setF('servico', '');
  }
  ariaSort(k: string) { const s = this.store.sort(); return s.k === k ? (s.dir > 0 ? 'ascending' : 'descending') : 'none'; }
  arrow(k: string) { const s = this.store.sort(); return s.k === k ? (s.dir > 0 ? '▲' : '▼') : '↕'; }
  sortBy(k: string) {
    const s = this.store.sort();
    this.store.sort.set(s.k === k ? { k, dir: -s.dir } : { k, dir: k === 'u' ? 1 : -1 });
  }

  private readonly man = computed(() => this.store.sel().filter((r) => CONC.has(r.st) && !r.auto && r.d != null));
  readonly q = computed(() => {
    const man = this.man(), dm = avg(man.map((r) => r.d as number)), q = (dm * 8) / 60;
    const cls = qClass(q);
    return { has: man.length > 0, q, cls, pct: Math.min(q / 12, 1) * 100, color: { ok: '#33A841', warn: '#C19515', err: '#BF0C1D' }[cls] };
  });
  readonly units = computed(() => {
    const per: Record<string, number[]> = {};
    this.man().forEach((r) => (per[r.u] = per[r.u] || []).push(r.d as number));
    const rows = Object.entries(per).map(([u, a]) => { const d = avg(a); return { u, concl: a.length, dias: d, q: (d * 8) / 60, cls: qClass((d * 8) / 60) as QClass }; });
    const { k, dir } = this.store.sort();
    const key = k as 'concl' | 'dias' | 'q';
    return rows.sort((a, b) => (k === 'u' ? dir * a.u.localeCompare(b.u) : dir * (a[key] - b[key])));
  });
  readonly daily = computed(() => {
    const rs = this.store.sel('periodo').filter((r) => r.m === 11), days = DMAX;
    const rows0 = [];
    for (let d = 1; d <= days; d++) {
      const x = rs.filter((r) => r.dd === d), co = x.filter((r) => CONC.has(r.st)).length;
      rows0.push({ d, n: x.length, co, at: x.length - co, rate: x.length ? (co / x.length) * 100 : null as number | null });
    }
    const tn = sum(rows0.map((r) => r.n)), tc = sum(rows0.map((r) => r.co)), tr = tn ? (tc / tn) * 100 : 0;
    const W = 720, H = 270, L = 40, B = 28, T = 18, pw = W - L - 8, ph = H - B - T, cw = pw / days, bw = Math.min(28, cw * 0.62);
    const grid = [0, 25, 50, 75, 100].map((v) => ({ v, y: T + ph - (v / 100) * ph }));
    const rows = rows0.map((r, k) => {
      const x = L + k * cw + (cw - bw) / 2, h = ((r.rate || 0) / 100) * ph;
      return {
        ...r, x0: L + k * cw, x, h, y: T + ph - h, dia: String(r.d).padStart(2, '0'),
        aria: `Dia ${r.d}: ${r.rate == null ? 'sem processos' : d1(r.rate) + '% de conclusão, ' + r.co + ' de ' + r.n}`,
        tip: `Dia ${r.d}: ${r.rate == null ? 'sem processos' : d1(r.rate) + '% · ' + r.co + ' concluídos de ' + r.n + ' criados'}`,
      };
    });
    return { rows, grid, W, H, L, T, ph, cw, bw, tn, tc, tr, ya: T + ph - (tr / 100) * ph };
  });
}
