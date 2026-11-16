import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Attn } from './attn';
import { Evo } from './evo';
import { Filters, Head, Tabs } from './filters';
import { Hero } from './hero';
import { Ico } from './ico';
import { Kpis } from './kpis';
import { Matrix } from './matrix';
import { Minis } from './minis';
import { Store } from './store';
import { ThemeView } from './theme';
import { Top } from './top';
import { UfMap } from './uf';

@Component({
  selector: 'app-dashboard',
  imports: [Head, Filters, Tabs, ThemeView, Ico, Matrix, UfMap, Hero, Kpis, Evo, Minis, Top, Attn],
  template: `<app-head /><app-filters /><app-tabs />
    @if (store.f().tema) {
      <app-theme />
    } @else {
      <div class="seg" role="group" aria-label="Formato">
        <button (click)="store.view.set('grafico')" [attr.aria-pressed]="store.view() === 'grafico'"><app-ico n="chart" [s]="16" />Gráfico</button>
        <button (click)="store.view.set('tabela')" [attr.aria-pressed]="store.view() === 'tabela'"><app-ico n="table" [s]="16" />Tabela</button>
      </div>
      @if (store.view() === 'tabela') {
        <app-matrix />
      } @else {
        <div class="row2"><app-uf /><app-hero /></div>
        <app-kpis />
        <div class="row3"><app-evo /><div class="minis"><app-minis /></div></div>
        <app-top />
        <app-attn />
      }
    }`,
})
export class Dashboard {
  readonly store = inject(Store);
  constructor() {
    /* Páginas internas de serviço: ?tema=…&servico=… */
    inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed()).subscribe((q) => {
      const tema = q.get('tema'), servico = q.get('servico');
      if (tema) {
        this.store.setF('tema', tema);
        if (servico) this.store.setF('servico', servico);
        window.scrollTo(0, 0);
      }
    });
  }
}
