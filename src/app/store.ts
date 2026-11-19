import { Injectable, computed, signal } from '@angular/core';
import { DATA, MONTHS, Row, THEMES, UNITS } from './data';

export interface Filters { tema: string; servico: string; status: string; uf: string; unidade: string; periodo: string; heroM: string }
export const KEY: Record<string, keyof Row> = { tema: 't', servico: 's', status: 'st', uf: 'uf', unidade: 'u' };
export const LABEL: Record<string, string> = { tema: 'Tema', servico: 'Serviço', status: 'Status', uf: 'UF', unidade: 'Unidade PF' };
export const allSvcNames = (t: string) => (t ? THEMES[t].svc : Object.values(THEMES).flatMap((x) => x.svc)).map((x) => x[1]);

@Injectable({ providedIn: 'root' })
export class Store {
  readonly f = signal<Filters>({ tema: '', servico: '', status: '', uf: '', unidade: '', periodo: '12', heroM: String(new Date().getMonth()) });
  readonly view = signal<'grafico' | 'tabela'>('grafico');
  readonly evo = signal<'macro' | 'op'>('macro');
  readonly open = signal(false);
  readonly allSvc = signal(false);
  readonly allView = signal(false);
  readonly collapsed = signal(false);
  readonly topAll = signal(false);
  readonly tabsOpen = signal(false);
  readonly attn = signal<number | null>(null);
  readonly sort = signal<{ k: string; dir: number }>({ k: 'concl', dir: -1 });

  readonly active = computed(() => Object.keys(KEY).filter((k) => (this.f() as unknown as Record<string, string>)[k]));
  readonly rows = computed(() => this.sel());

  /** Processos filtrados; `skip` ignora um filtro (usado por gráficos que o controlam). */
  sel(skip?: string): Row[] {
    const f = this.f() as unknown as Record<string, string>, from = 12 - +f['periodo'];
    return DATA.filter((r) => (skip === 'periodo' || r.m >= from) && Object.keys(KEY).every((k) => k === skip || !f[k] || (r[KEY[k]] as string) === f[k]));
  }
  setF(k: keyof Filters, v: string) {
    const f = { ...this.f(), [k]: v } as Filters;
    if (k === 'tema') {
      this.allView.set(false);
      if (f.servico && !allSvcNames(v).includes(f.servico)) f.servico = '';
      this.allSvc.set(false);
    }
    if (k === 'uf' && f.unidade && f.uf && !UNITS[f.uf].includes(f.unidade)) f.unidade = '';
    if (k === 'unidade' && v) f.uf = v.split('/').pop() as string;
    this.f.set(f);
  }
  toggleF(k: keyof Filters, v: string) {
    if (k === 'servico') this.allView.set(false);
    this.setF(k, this.f()[k] === v ? '' : v);
  }
  clearAll() {
    this.f.update((f) => ({ ...f, tema: '', servico: '', status: '', uf: '', unidade: '' }));
  }
  firstMonth() { return MONTHS[12 - +this.f().periodo]; }
}
