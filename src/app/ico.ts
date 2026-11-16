import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from './util';

/** Ícone SVG a partir do mapa ICONS (conteúdo estático e confiável). */
@Component({
  selector: 'app-ico',
  host: { '[innerHTML]': 'html()' },
  template: '',
})
export class Ico {
  private readonly san = inject(DomSanitizer);
  readonly n = input.required<string>();
  readonly s = input(20);
  readonly w = input(2);
  readonly html = computed(() =>
    this.san.bypassSecurityTrustHtml(
      `<svg width="${this.s()}" height="${this.s()}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${this.w()}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[this.n()] ?? ''}</svg>`,
    ),
  );
}
