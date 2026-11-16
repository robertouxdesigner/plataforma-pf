import { Row, CONC } from './data';

export const nf = (n: number) => Math.round(n).toLocaleString('pt-BR');
export const d1 = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
export const avg = (a: number[]) => (a.length ? sum(a) / a.length : 0);
export const cap = (m: string) => m[0].toUpperCase() + m.slice(1);
export const mAvg = (a: Row[]) => avg(a.filter((r) => r.d != null && !r.auto).map((r) => r.d as number));
export function niceStep(x: number) {
  const m = Math.pow(10, Math.floor(Math.log10(x))), n = x / m;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * m;
}
export type QClass = 'ok' | 'warn' | 'err';
export const qClass = (q: number): QClass => (q <= 6 ? 'ok' : q <= 8 ? 'warn' : 'err');
export const qText: Record<QClass, string> = { ok: 'Dentro da meta', warn: 'Próximo da meta', err: 'Fora da meta' };
export function hoje() {
  const d = new Date();
  const m = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][d.getMonth()];
  return `${String(d.getDate()).padStart(2, '0')}/${m} ${d.getFullYear()}`;
}

export interface Delta { none: boolean; good: boolean; up: boolean; text: string }
/** Variação = (atual − anterior) ÷ anterior × 100 (meses 11 e 10). */
export function computeDelta(rows: Row[], pred: (r: Row) => boolean, fn?: ((a: Row[]) => number) | null, inv = false): Delta {
  const rs = rows.filter(pred), a = rs.filter((r) => r.m === 11), b = rs.filter((r) => r.m === 10);
  const va = fn ? fn(a) : a.length, vb = fn ? fn(b) : b.length;
  if (!vb) return { none: true, good: false, up: false, text: '' };
  const p = ((va - vb) / vb) * 100, up = p >= 0;
  return { none: false, up, good: inv ? !up : up, text: `${up ? '+' : '−'}${d1(Math.abs(p))}% vs mês anterior` };
}
export const isConc = (r: Row) => CONC.has(r.st);

export const ICONS: Record<string, string> = {
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  chart: '<path d="M6 20V10M12 20V4M18 20v-7"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 4v16"/>',
  filter: '<path d="M3 4h18l-7 8v7l-4 2v-9z"/>',
  x: '<path d="M5 5l14 14M19 5L5 19"/>',
  chevron: '<path d="M5 9l7 7 7-7"/>',
  bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
  queue: '<path d="M3 4h7v7H3zM14 5h7M14 10h7M3 15h7v6H3zM14 16h7M14 20h7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  gun: '<path d="M3 7h15l3 2v3h-8l-1.5 5h-4L9 12H3z"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>',
  cert: '<rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16l-1 5 4-2 4 2-1-5"/>',
  renew: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
  wallet: '<path d="M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l2-3h12M16 14h3"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  doc: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7"/>',
  cancel: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  flask: '<path d="M9 3h6M10 3v6L4 19a2 2 0 002 3h12a2 2 0 002-3l-6-10V3"/>',
  building: '<path d="M4 21V5l8-2 8 2v16zM9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4"/>',
  heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 10c0 6-8 11-8 11z"/>',
  plane: '<path d="M2 13l8-2 5-8 2 1-2 8 6 2v2l-8-1-3 5-2-1 1-5-7-1z"/>',
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0014 0M8 11h8"/>',
};
