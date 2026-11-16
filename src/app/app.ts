import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ico } from './ico';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ico],
  template: `<header class="topbar">
      <div class="logo"><sup>PF/</sup>Portal PF</div>
      <div class="user">
        <div class="user-info">James David Gordon<small>Unidade: NUCRIM/SETEC/SR/PF/RJ</small></div>
        <div class="avatar" aria-hidden="true">JG</div>
        <div class="bell" aria-label="9 notificações"><app-ico n="bell" [s]="20" style="color: #fff" /><b>9+</b></div>
      </div>
    </header>
    <div class="layout">
      <nav class="side" aria-label="Principal">
        <a href="#"><app-ico n="queue" [s]="16" />Fila de Trabalho</a>
        <a href="#"><app-ico n="search" [s]="16" />Relatórios</a>
        <a href="#"><app-ico n="chart" [s]="16" />Construtor de Fórmulas</a>
        <a href="#" aria-current="page"><app-ico n="lock" [s]="16" />Administração</a>
      </nav>
      <main id="app" aria-live="polite"><router-outlet /></main>
    </div>`,
})
export class App {}
