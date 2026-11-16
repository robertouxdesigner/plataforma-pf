import { NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, computed, inject } from '@angular/core';
import { Store } from './store';

interface Att { p: 't' | 'l' | 'r'; t: string; l: string[]; d: string; pct: number; up: boolean; green: boolean; h: string; s: string; rows: string[][] }
const ATT: Att[] = [
  { p: 't', t: 'Renovação de CR com aumento de demanda', l: ['+32% de solicitações', 'Crescimento contínuo a 3 meses'], d: '+32% vs mês anterior', pct: 32, up: true, green: true, h: 'Renovação de CR · por unidade', s: 'Solicitações em Nov/26 (exemplo)', rows: [['SR/SP', '1.240', '+41%'], ['SR/RJ', '860', '+35%'], ['SR/MG', '612', '+29%'], ['SR/DF', '540', '+27%'], ['SR/PR', '488', '+22%']] },
  { p: 'l', t: 'Passaporte acima do SLA', l: ['Tempo médio: 17 dias', 'Meta: 10 dias'], d: '+18% vs mês anterior', pct: 18, up: false, green: false, h: 'Passaporte · unidades acima da meta', s: 'Tempo médio de atendimento (exemplo)', rows: [['SR/SP', '21 dias', '+11 dias'], ['SR/RJ', '19 dias', '+9 dias'], ['SR/DF', '17 dias', '+7 dias'], ['SR/MG', '15 dias', '+5 dias'], ['SR/PR', '14 dias', '+4 dias']] },
  { p: 'r', t: 'Fila de Guia de Tráfego crescendo', l: ['8.452 processos pendentes', 'Impacto: 12 estados'], d: '+18% vs mês anterior', pct: 18, up: true, green: true, h: 'Guia de Tráfego · fila por estado', s: 'Processos pendentes (exemplo)', rows: [['SP', '1.980', '+22%'], ['RJ', '1.250', '+19%'], ['MG', '980', '+17%'], ['RS', '760', '+14%'], ['PR', '655', '+12%']] },
];
/* >70% vermelho forte (red/500) · >50% laranja · demais: tom padrão */
const attC = (p: number) => (p > 70 ? '#BF0C1D' : p > 50 ? '#FF7300' : '#D6989C');
const attT = (p: number) => (p > 70 ? '#BF0C1D' : p > 50 ? '#FF7300' : null);

@Component({
  selector: 'app-attn',
  imports: [NgTemplateOutlet],
  template: `<section class="att" aria-labelledby="att-t">
    <div class="att-h"><h3 id="att-t">Painel de Atenção Imediata (top 3 Serviços)</h3><p>Previsão inteligente para tomada de decisões.</p></div>
    <div class="att-stage">
      <ng-container *ngTemplateOutlet="cardTpl; context: { c: att[0], i: 0 }" />
      <ng-container *ngTemplateOutlet="cardTpl; context: { c: att[1], i: 1 }" />
      <svg class="att-shield" viewBox="0 0 480 400" role="img" aria-label="Escudo central do painel de atenção" (mousemove)="move($event)" (mouseleave)="leave($event)">
        <g fill="none" stroke-width="1">
          <path d="M240 8V34" [attr.stroke]="col[0]" /><path d="M10 100L80 150" [attr.stroke]="col[1]" /><path d="M470 100L400 150" [attr.stroke]="col[2]" />
        </g>
        <circle cx="240" cy="8" r="3" [attr.fill]="col[0]" /><circle cx="240" cy="36" r="9" [attr.fill]="col[0]" />
        <circle cx="10" cy="100" r="3" [attr.fill]="col[1]" /><circle cx="80" cy="150" r="9" [attr.fill]="col[1]" />
        <circle cx="470" cy="100" r="3" [attr.fill]="col[2]" /><circle cx="400" cy="150" r="9" [attr.fill]="col[2]" />
        <g class="px" style="--k: 8; --r: 22">
          <path d="M114 113Q177 97 240 60Q303 97 366 113V215C366 290 310 340 240 359C170 340 114 290 114 215Z" fill="none" [attr.stroke]="ring" stroke-width="18" stroke-linejoin="miter" />
        </g>
      </svg>
      <ng-container *ngTemplateOutlet="cardTpl; context: { c: att[2], i: 2 }" />
    </div>
  </section>
  <ng-template #cardTpl let-c="c" let-i="i">
    <div class="att-w" [class]="'att-w ' + c.p">
      <button class="att-card" (click)="toggle(i, $event)" [attr.aria-expanded]="store.attn() === i" aria-haspopup="dialog">
        <div class="att-t">
          <span class="att-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></svg></span>{{ c.t }}
        </div>
        <div class="att-b">
          <div>@for (x of c.l; track x) { {{ x }}<br /> }</div>
          <div class="att-d">
            @if (c.up) {
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none" [attr.stroke]="c.green ? '#33A841' : '#BF0C1D'" stroke-width="1.5"><path d="M1 13l6-6 4 4 8-8M15 3h5v5" /></svg>
            } @else {
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="#BF0C1D" stroke-width="1.5"><path d="M1 3l6 6 4-4 8 8M15 13h5V8" /></svg>
            }
            <span [style.color]="t(c.pct)" [style.font-weight]="t(c.pct) ? 500 : null">{{ c.d }}</span>
          </div>
        </div>
      </button>
      @if (store.attn() === i) {
        <div class="att-pop" role="dialog" [attr.aria-label]="c.h">
          <button class="att-x" (click)="close($event)" aria-label="Fechar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 5l14 14M19 5L5 19" /></svg></button>
          <h4>{{ c.h }}</h4>
          <small>{{ c.s }}</small>
          <ul>
            @for (r of c.rows; track r[0]) {
              <li><b>{{ r[0] }}</b><span>{{ r[1] }} · <b [style.color]="t(num(r[2]))">{{ r[2] }}</b></span></li>
            }
          </ul>
        </div>
      }
    </div>
  </ng-template>`,
})
export class Attn {
  readonly store = inject(Store);
  readonly att = ATT;
  readonly col = ATT.map((c) => attC(c.pct));
  readonly ring = attC(Math.max(...ATT.map((c) => c.pct)));
  readonly t = attT;
  num(s: string) { return parseFloat(s); }
  toggle(i: number, e: Event) { e.stopPropagation(); this.store.attn.set(this.store.attn() === i ? null : i); }
  close(e: Event) { e.stopPropagation(); this.store.attn.set(null); }
  @HostListener('document:click', ['$event']) outside(e: Event) {
    if (this.store.attn() != null && !(e.target as HTMLElement).closest('.att-card,.att-pop')) this.store.attn.set(null);
  }
  @HostListener('document:keydown.escape') esc() { this.store.attn.set(null); }
  /* Parallax horizontal em perspectiva: só o símbolo reage ao mouse. */
  move(e: MouseEvent) {
    const v = e.currentTarget as SVGElement, r = v.getBoundingClientRect();
    v.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(2));
  }
  leave(e: MouseEvent) { (e.currentTarget as SVGElement).style.setProperty('--px', '0'); }
}
