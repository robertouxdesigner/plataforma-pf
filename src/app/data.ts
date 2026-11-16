/* Dados de exemplo (sintéticos, gerados localmente).
   Os números NÃO são dados reais: troque DATA por sua fonte. */
export const MONTHS = ['dez/25', 'jan/26', 'fev/26', 'mar/26', 'abr/26', 'mai/26', 'jun/26', 'jul/26', 'ago/26', 'set/26', 'out/26', 'nov/26'];
export const STATUSES = ['Deferido', 'Tramitação automática', 'Em análise', 'Indeferido', 'Restituído arquivado', 'Pronto para Análise', 'Restituído ativo'];
export const CONC = new Set(['Deferido', 'Tramitação automática', 'Indeferido', 'Restituído arquivado']);

export type Svc = [sigla: string, nome: string, peso: number, icon?: string];
export interface Theme { abbr: string; icon: string; svc: Svc[] }

export const THEMES: Record<string, Theme> = {
  'Armas': { abbr: 'AR', icon: 'gun', svc: [['AA', 'Autorização para Aquisição', 4821, 'gun'], ['GT', 'Guia de Tráfego', 8532, 'truck'], ['CR', 'Concessão de CR', 1400, 'cert'], ['CRAF', 'Registro/Emissão de CRAF', 2118, 'wallet'], ['AP', 'Apostilamento', 1245, 'doc'], ['RCRAF', 'Renovação de CRAF', 5103, 'renew'], ['RCR', 'Revalidação de CR', 942, 'shield'], ['CCR', 'Cancelamento de CR', 233, 'cancel']] },
  'Adoção Internacional': { abbr: 'AI', icon: 'heart', svc: [['HA', 'Habilitação para Adoção', 80], ['PA', 'Acompanhamento Pós-Adoção', 60]] },
  'Segurança Aeroportuária': { abbr: 'SA', icon: 'plane', svc: [['CA', 'Credencial Aeroportuária', 120], ['PS', 'Plano de Segurança Aeroportuária', 70]] },
  'Segurança Portuário': { abbr: 'SP', icon: 'anchor', svc: [['CP', 'Credencial Portuária', 100], ['PP', 'Plano de Segurança Portuária', 60]] },
  'Antecedentes Criminais': { abbr: 'AC', icon: 'doc', svc: [['CAC', 'Emitir Certidão de Antecedentes Criminais', 3954], ['VCA', 'Validar Certidão de Antecedentes Criminais', 600]] },
  'Migração': { abbr: 'MG', icon: 'globe', svc: [['SAR', 'Solicitar autorização de residência', 1887], ['RAR', 'Renovar autorização de residência', 900], ['TAR', 'Transformar autorização de residência', 500], ['CRNM', 'Emissão de CRNM', 700], ['ACM', 'Atualizações cadastrais migratórias', 350]] },
  'Passaporte': { abbr: 'PP', icon: 'passport', svc: [['PC', 'Emissão de Passaporte Comum', 7842], ['PE', 'Passaporte de Emergência', 400], ['PES', 'Passaporte para Estrangeiro', 300], ['LP', 'Laissez-Passer', 90], ['OD', 'Outros documentos de viagem', 120]] },
  'Produtos Químicos': { abbr: 'PQ', icon: 'flask', svc: [['CPQ', 'Cadastro para Controle de Produtos Químicos', 687], ['LPQ', 'Licença para Controle de Produtos Químicos', 450], ['RL', 'Renovação de licença', 300], ['ACE', 'Atualização cadastral de empresa controlada', 150]] },
  'Segurança Privada': { abbr: 'SV', icon: 'shield', svc: [['AF', 'Autorização de funcionamento', 260], ['CRG', 'Certificado de Regularidade', 182], ['GTA', 'Guia de Transporte de Armas, Munições e Petrechos', 220], ['AC', 'Alteração cadastral', 140], ['RA', 'Renovação de autorização', 130], ['EA', 'Encerramento das atividades', 60], ['CRE', 'Consulta de regularidade', 210]] },
  'Empresas com Armamento': { abbr: 'EA', icon: 'building', svc: [['GTE', 'Guia de transporte de armas', 160], ['CAE', 'Controle de armamento corporativo', 110], ['AVS', 'Autorizações vinculadas à segurança privada', 90]] },
};

export interface ServiceInfo { t: string; sigla: string; nome: string; w: number; icon: string }
export const ALL: ServiceInfo[] = Object.entries(THEMES).flatMap(([t, th]) =>
  th.svc.map((x) => ({ t, sigla: x[0], nome: x[1], w: x[2], icon: x[3] ?? th.icon })),
);
export const TN = Object.keys(THEMES);

export const UFW: Record<string, number> = { SP: 580, RJ: 450, MG: 290, DF: 245, RS: 238, PR: 222, GO: 181, BA: 166, PE: 139, AM: 104, PA: 95, CE: 90, SC: 85, MT: 76, ES: 65, MS: 58, MA: 51, PB: 47, RN: 44, AL: 38, PI: 34, RO: 29, TO: 26, SE: 23, AC: 18, AP: 13, RR: 9 };
export const UFS = Object.keys(UFW);
export const UNITS: Record<string, string[]> = {};
UFS.forEach((u) => (UNITS[u] = ['SR/PF/' + u]));
UNITS['SP'].push('DPF/SOC/SP', 'DPF/STS/SP');
UNITS['RJ'].push('DPF/CAF/RJ');
export const GRID: Record<string, [number, number]> = { RR: [0, 3], AP: [0, 4], AM: [1, 2], PA: [1, 3], MA: [1, 4], CE: [1, 5], RN: [1, 6], AC: [2, 1], RO: [2, 2], MT: [2, 3], TO: [2, 4], PI: [2, 5], PB: [2, 6], MS: [3, 2], GO: [3, 3], DF: [3, 4], BA: [3, 5], PE: [3, 6], AL: [3, 7], SP: [4, 3], MG: [4, 4], ES: [4, 5], SE: [4, 6], PR: [5, 3], RJ: [5, 4], SC: [6, 3], RS: [7, 3] };

export interface Row {
  t: string; s: string; uf: string; u: string; m: number; dd: number;
  gru: boolean; auto: boolean; d: number | null; age: number | null; st: string;
}

function rng(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(20261112);
const R2 = rng(99);
export const DMAX = Math.min(28, new Date().getDate());

function pick<T>(items: T[], w: number[]): T {
  let s = 0;
  w.forEach((x) => (s += x));
  let r = R() * s;
  for (let i = 0; i < items.length; i++) {
    r -= w[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

const UBIAS: Record<string, number> = {};
Object.values(UNITS).flat().forEach((u) => (UBIAS[u] = R() * 20 - 5));
const MW = MONTHS.map((_, i) => 3 + i * 0.5);

export const DATA: Row[] = [];
for (let i = 0; i < 3416; i++) {
  const sv = pick(ALL, ALL.map((x) => x.w));
  const t = sv.t, s = sv.nome;
  const uf = pick(UFS, UFS.map((k) => UFW[k]));
  const ul = UNITS[uf];
  const u = ul[R() < 0.75 ? 0 : Math.floor(R() * ul.length)];
  const m = pick(MONTHS.map((_, k) => k), MW);
  const rec = 11 - m;
  const ativo = R() < 0.02 + Math.pow(m / 11, 2) * 0.6;
  const r: Row = { t, s, uf, u, m, dd: 1 + Math.floor(R2() * (m === 11 ? DMAX : 28)), gru: R() < 0.07, auto: false, d: null, age: null, st: '' };
  if (ativo) {
    r.st = pick(['Em análise', 'Pronto para Análise', 'Restituído ativo'], [5, 3, 2]);
    r.age = Math.floor(R() * 30) + rec * 26;
  } else {
    r.st = pick(['Deferido', 'Tramitação automática', 'Indeferido', 'Restituído arquivado'], [44, 32, 6, 18]);
    r.auto = r.st === 'Tramitação automática';
    r.d = r.auto ? 1 : Math.min(95, Math.max(6, Math.round(33 + UBIAS[u] + (R() + R() + R() - 1.5) * 14)));
  }
  DATA.push(r);
}
