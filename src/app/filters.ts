import { Component, ElementRef, HostListener, afterEveryRender, computed, inject } from '@angular/core';
import { MONTHS, STATUSES, TN, UFS, UNITS } from './data';
import { Ico } from './ico';
import { LABEL, Store, allSvcNames } from './store';
import { nf } from './util';

@Component({
  selector: 'app-head',
  imports: [Ico],
  template: `<div class="head">
    <div>
      <h1>Indicadores</h1>
      <p>Gestão de relatórios do Portal PF. Os filtros se ajustam em cascata e todos os gráficos respondem à seleção.</p>
    </div>
    <div class="head-r">
      <span>Atualizado às {{ hora }}</span>
      <button class="fab" (click)="store.open.set(!store.open())" [attr.aria-expanded]="store.open()" aria-controls="filters" [attr.aria-label]="store.open() ? 'Recolher filtros' : 'Abrir filtros'">
        <app-ico n="filter" [s]="18" />
      </button>
    </div>
  </div>`,
})
export class Head {
  readonly store = inject(Store);
  readonly hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

@Component({
  selector: 'app-filters',
  imports: [Ico],
  template: `<section class="panel filters" id="filters" aria-label="Refinar resultados de filtro" [hidden]="!store.open()">
    <div class="filters-h">
      <div>
        <h2>Refinar resultados de filtro</h2>
        <small>Os filtros são aplicados automaticamente e atualizam todos os indicadores.</small>
      </div>
      <button class="link" (click)="store.open.set(false)">Recolher filtro</button>
    </div>
    <div class="fgrid">
      @for (fl of fields(); track fl.k) {
        <div class="field">
          <label [for]="'f-' + fl.k">{{ fl.label }}</label>
          <select [id]="'f-' + fl.k" [class.on]="!!fl.cur && !!fl.all" (change)="change(fl.k, $event)">
            @if (fl.all) {
              <option value="" [selected]="!fl.cur">{{ fl.all }}</option>
            }
            @for (o of fl.opts; track o[0]) {
              <option [value]="o[0]" [selected]="o[0] === fl.cur">{{ o[1] }}</option>
            }
          </select>
        </div>
      }
    </div>
    <div class="fsum">
      <div class="chips">
        @if (store.active().length) {
          @for (k of store.active(); track k) {
            <button class="chip" (click)="store.setF($any(k), '')" [attr.aria-label]="'Remover filtro ' + label[k] + ': ' + val(k)">
              {{ label[k] }}: {{ val(k) }} <app-ico n="x" [s]="10" [w]="3" />
            </button>
          }
          <button class="link" (click)="store.clearAll()">Limpar filtros</button>
        } @else {
          Nenhum filtro aplicado. Clique nas barras dos gráficos para filtrar rapidamente.
        }
      </div>
      <span><b>{{ nf(store.rows().length) }}</b> processos · {{ store.firstMonth() }} a {{ last }}</span>
    </div>
  </section>`,
})
export class Filters {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly label = LABEL;
  readonly last = MONTHS[11];
  val(k: string) { return (this.store.f() as unknown as Record<string, string>)[k]; }
  change(k: string, e: Event) { this.store.setF(k as never, (e.target as HTMLSelectElement).value); }
  readonly fields = computed(() => {
    const f = this.store.f();
    const units = f.uf ? UNITS[f.uf] : Object.values(UNITS).flat();
    const dup = (l: string[]) => l.map((v) => [v, v]);
    return [
      { k: 'tema', label: 'Tema', cur: f.tema, all: 'Todos', opts: dup(TN) },
      { k: 'servico', label: 'Serviço', cur: f.servico, all: 'Todos', opts: dup(allSvcNames(f.tema)) },
      { k: 'status', label: 'Status', cur: f.status, all: 'Todos', opts: dup(STATUSES) },
      { k: 'uf', label: 'UF', cur: f.uf, all: 'Todas', opts: dup([...UFS].sort()) },
      { k: 'unidade', label: 'Unidade PF', cur: f.unidade, all: 'Todas', opts: dup(units) },
      { k: 'periodo', label: 'Período', cur: f.periodo, all: '', opts: [['12', 'Últimos 12 meses'], ['6', 'Últimos 6 meses'], ['3', 'Últimos 3 meses']] },
    ];
  });
}

@Component({
  selector: 'app-tabs',
  imports: [],
  template: `<div class="themes-t" id="themes-t">Filtro por Temas</div>
    <div class="tabs-w" id="tabs-w" [class.open]="store.tabsOpen()">
      <div class="tabs" role="tablist" aria-labelledby="themes-t">
        @for (t of temas; track t) {
          <button class="tab" role="tab" [attr.aria-selected]="isOn(t)" (click)="store.setF('tema', t === 'Visão padrão' ? '' : t)">{{ t }}</button>
        }
      </div>
      <button class="tabs-x" (click)="store.tabsOpen.set(!store.tabsOpen())" [attr.aria-expanded]="store.tabsOpen()" aria-controls="tabs-w" aria-label="Mostrar todos os temas">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 9l7 7 7-7" /></svg>
      </button>
    </div>`,
})
export class Tabs {
  readonly store = inject(Store);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly temas = ['Visão padrão', ...TN];
  isOn(t: string) { return (t === 'Visão padrão' ? '' : t) === this.store.f().tema; }
  constructor() { afterEveryRender(() => this.fit()); }
  @HostListener('window:resize') fit() {
    const w = this.el.nativeElement.querySelector('#tabs-w') as HTMLElement | null;
    if (!w) return;
    const t = w.querySelector('.tabs') as HTMLElement, o = w.classList.contains('open');
    w.classList.remove('open');
    const more = t.scrollWidth > t.clientWidth + 1;
    w.classList.toggle('more', more || o);
    w.classList.toggle('open', o);
    if (!o) {
      const a = t.querySelector('[aria-selected=true]') as HTMLElement | null;
      if (a) t.scrollLeft = Math.max(0, a.offsetLeft - t.offsetLeft - 8);
    }
  }
}
