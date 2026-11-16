import { Component, computed, inject } from '@angular/core';
import { STATUSES } from './data';
import { Store } from './store';
import { nf } from './util';

@Component({
  selector: 'app-matrix',
  template: `@if (rows().length) {
    <section class="panel card">
      <div class="card-h"><div><h3>Serviços x status</h3><small>{{ rows().length }} serviços · {{ nf(store.rows().length) }} processos</small></div></div>
      <div class="tw"><table>
        <thead><tr><th>Tema</th><th>Serviço</th><th class="num">Total</th>@for (s of statuses; track s) { <th class="num">{{ s }}</th> }</tr></thead>
        <tbody>
          @for (r of rows(); track r.t + r.s) {
            <tr><td>{{ r.t }}</td><td>{{ r.s }}</td><td class="num"><b>{{ nf(r.n) }}</b></td>@for (v of r.by; track $index) { <td class="num">{{ nf(v) }}</td> }</tr>
          }
        </tbody>
      </table></div>
    </section>
  } @else {
    <div class="panel empty-state">Nenhum processo para os filtros selecionados.</div>
  }`,
})
export class Matrix {
  readonly store = inject(Store);
  readonly nf = nf;
  readonly statuses = STATUSES;
  readonly rows = computed(() => {
    const rs = this.store.rows(), keys = [...new Set(rs.map((r) => r.t + '|' + r.s))].sort();
    return keys.map((k) => {
      const [t, s] = k.split('|'), x = rs.filter((r) => r.t === t && r.s === s);
      return { t, s, n: x.length, by: STATUSES.map((st) => x.filter((r) => r.st === st).length) };
    }).sort((a, b) => b.n - a.n);
  });
}
