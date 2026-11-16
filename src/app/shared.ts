import { Component, input } from '@angular/core';
import { Delta } from './util';

@Component({
  selector: 'app-delta',
  template: `@if (d().none) {
      <span class="delta">— sem base de comparação</span>
    } @else {
      <span class="delta" [class.up]="d().good" [class.down]="!d().good"
        ><svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path [attr.d]="d().up ? 'M1 9l4-5 3 3 7-6' : 'M1 1l4 5 3-3 7 6'" /></svg
        >{{ d().text }}</span
      >
    }`,
})
export class DeltaView {
  readonly d = input.required<Delta>();
}
