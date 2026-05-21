/**
 * Ad Manager CSV/Excel Importer
 * Suporta exportações do Meta Ads e Google Ads
 */

import { Lead, LeadOrigin, PipelineStage, LeadPriority } from '@/types/lead';

export type AdPlatform = 'meta' | 'google' | 'auto';

export interface ImportResult {
  leads: Lead[];
  metrics: ImportedMetrics;
  errors: string[];
  platform: AdPlatform;
  totalRows: number;
  importedRows: number;
}

export interface ImportedMetrics {
  totalLeads: number;
  totalClicks: number;
  totalImpressions: number;
  totalSpend: number;
  totalConversions: number;
  ctr: number;
  cpc: number;
  cpl: number; // custo por lead
}

// Mapeamento de colunas do Meta Ads
const META_COLUMN_MAP: Record<string, string> = {
  'nome': 'name',
  'name': 'name',
  'nome completo': 'name',
  'full name': 'name',
  'e-mail': 'email',
  'email': 'email',
  'telefone': 'phone',
  'phone': 'phone',
  'phone number': 'phone',
  'número de telefone': 'phone',
  'campanha': 'campaign',
  'campaign name': 'campaign',
  'nome da campanha': 'campaign',
  'conjunto de anúncios': 'adset',
  'ad set name': 'adset',
  'anúncio': 'ad',
  'ad name': 'ad',
  'data': 'date',
  'date': 'date',
  'cliques': 'clicks',
  'clicks': 'clicks',
  'link clicks': 'clicks',
  'impressões': 'impressions',
  'impressions': 'impressions',
  'valor gasto': 'spend',
  'amount spent': 'spend',
  'spend': 'spend',
  'resultados': 'conversions',
  'results': 'conversions',
  'leads': 'conversions',
  'ctr': 'ctr',
  'cpc': 'cpc',
  'cpl': 'cpl',
  'cost per lead': 'cpl',
  'custo por lead': 'cpl',
  'veículo de interesse': 'vehicleInterest',
  'vehicle interest': 'vehicleInterest',
  'serviço de interesse': 'serviceInterest',
  'service interest': 'serviceInterest',
};

// Mapeamento de colunas do Google Ads
const GOOGLE_COLUMN_MAP: Record<string, string> = {
  'customer': 'name',
  'customer name': 'name',
  'nome do cliente': 'name',
  'email': 'email',
  'phone': 'phone',
  'campaign': 'campaign',
  'campaign name': 'campaign',
  'nome da campanha': 'campaign',
  'ad group': 'adset',
  'grupo de anúncios': 'adset',
  'clicks': 'clicks',
  'cliques': 'clicks',
  'impressions': 'impressions',
  'impressões': 'impressions',
  'cost': 'spend',
  'custo': 'spend',
  'conversions': 'conversions',
  'conversões': 'conversions',
  'ctr': 'ctr',
  'avg. cpc': 'cpc',
  'cpc médio': 'cpc',
  'cost / conv.': 'cpl',
  'custo / conv.': 'cpl',
  'date': 'date',
  'day': 'date',
  'dia': 'date',
};

function detectPlatform(headers: string[]): AdPlatform {
  const headerStr = headers.join(' ').toLowerCase();
  
  const metaKeywords = ['conjunto de anúncios', 'ad set', 'valor gasto', 'amount spent', 'facebook', 'instagram', 'meta'];
  const googleKeywords = ['avg. cpc', 'ad group', 'grupo de anúncios', 'cost / conv', 'google'];
  
  const metaScore = metaKeywords.filter(k => headerStr.includes(k)).length;
  const googleScore = googleKeywords.filter(k => headerStr.includes(k)).length;
  
  if (metaScore > googleScore) return 'meta';
  if (googleScore > metaScore) return 'google';
  return 'auto';
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/['"]/g, '');
}

function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  // Detectar separador (vírgula ou ponto-e-vírgula)
  const firstLine = lines[0];
  const separator = firstLine.includes(';') ? ';' : ',';

  const headers = firstLine.split(separator).map(h => h.trim().replace(/^["']|["']$/g, ''));
  
  const rows = lines.slice(1).map(line => {
    const values = line.split(separator).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });

  return { headers, rows };
}

function mapRow(row: Record<string, string>, platform: AdPlatform): Record<string, string> {
  const columnMap = platform === 'google' ? GOOGLE_COLUMN_MAP : META_COLUMN_MAP;
  const mapped: Record<string, string> = {};
  
  Object.entries(row).forEach(([key, value]) => {
    const normalizedKey = normalizeHeader(key);
    const mappedKey = columnMap[normalizedKey];
    if (mappedKey) {
      mapped[mappedKey] = value;
    } else {
      mapped[normalizedKey] = value;
    }
  });
  
  return mapped;
}

function inferPriority(row: Record<string, string>): LeadPriority {
  const spend = parseFloat(row.spend || '0');
  const clicks = parseInt(row.clicks || '0');
  
  if (spend > 500 || clicks > 100) return 'alta';
  if (spend > 100 || clicks > 20) return 'media';
  return 'baixa';
}

function inferScore(row: Record<string, string>): number {
  const ctr = parseFloat(row.ctr || '0');
  const conversions = parseInt(row.conversions || '0');
  
  let score = 30;
  if (ctr > 3) score += 20;
  else if (ctr > 1) score += 10;
  if (conversions > 0) score += 30;
  
  return Math.min(score, 100);
}

function rowToLead(row: Record<string, string>, platform: AdPlatform, index: number): Lead | null {
  const mapped = mapRow(row, platform);
  
  // Precisa ter pelo menos nome ou email
  if (!mapped.name && !mapped.email) return null;
  
  const origin: LeadOrigin = platform === 'google' ? 'Google Ads' : 'Meta Ads';
  
  return {
    id: `imported-${platform}-${Date.now()}-${index}`,
    name: mapped.name || mapped.email?.split('@')[0] || `Lead ${index + 1}`,
    phone: mapped.phone || '',
    email: mapped.email || undefined,
    vehicleInterest: mapped.vehicleInterest || mapped.campaign || 'A definir',
    serviceInterest: mapped.serviceInterest || undefined,
    origin,
    stage: 'novo_lead' as PipelineStage,
    priority: inferPriority(mapped),
    score: inferScore(mapped),
    createdAt: mapped.date ? new Date(mapped.date) : new Date(),
    updatedAt: new Date(),
    notes: mapped.campaign ? `Campanha: ${mapped.campaign}${mapped.adset ? ` | Conjunto: ${mapped.adset}` : ''}` : undefined,
    tasks: [],
    interactions: [],
  };
}

function calculateMetrics(rows: Record<string, string>[], platform: AdPlatform): ImportedMetrics {
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalSpend = 0;
  let totalConversions = 0;

  rows.forEach(row => {
    const mapped = mapRow(row, platform);
    totalClicks += parseInt(mapped.clicks || '0') || 0;
    totalImpressions += parseInt(mapped.impressions || '0') || 0;
    totalSpend += parseFloat(mapped.spend?.replace(',', '.') || '0') || 0;
    totalConversions += parseInt(mapped.conversions || '0') || 0;
  });

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const cpl = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return {
    totalLeads: totalConversions || rows.length,
    totalClicks,
    totalImpressions,
    totalSpend,
    totalConversions,
    ctr,
    cpc,
    cpl,
  };
}

export async function importFromFile(file: File, platformHint: AdPlatform = 'auto'): Promise<ImportResult> {
  const errors: string[] = [];
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (!content) {
        resolve({ leads: [], metrics: emptyMetrics(), errors: ['Arquivo vazio'], platform: 'auto', totalRows: 0, importedRows: 0 });
        return;
      }

      const { headers, rows } = parseCSV(content);
      
      if (headers.length === 0) {
        resolve({ leads: [], metrics: emptyMetrics(), errors: ['Formato de arquivo inválido'], platform: 'auto', totalRows: 0, importedRows: 0 });
        return;
      }

      const platform = platformHint === 'auto' ? detectPlatform(headers) : platformHint;
      const metrics = calculateMetrics(rows, platform);
      
      const leads: Lead[] = [];
      rows.forEach((row, i) => {
        try {
          const lead = rowToLead(row, platform, i);
          if (lead) leads.push(lead);
        } catch (err) {
          errors.push(`Linha ${i + 2}: ${err}`);
        }
      });

      resolve({
        leads,
        metrics,
        errors,
        platform,
        totalRows: rows.length,
        importedRows: leads.length,
      });
    };

    reader.onerror = () => {
      resolve({ leads: [], metrics: emptyMetrics(), errors: ['Erro ao ler arquivo'], platform: 'auto', totalRows: 0, importedRows: 0 });
    };

    reader.readAsText(file, 'UTF-8');
  });
}

function emptyMetrics(): ImportedMetrics {
  return { totalLeads: 0, totalClicks: 0, totalImpressions: 0, totalSpend: 0, totalConversions: 0, ctr: 0, cpc: 0, cpl: 0 };
}
