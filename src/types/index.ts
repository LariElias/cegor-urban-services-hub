
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cegor' | 'regional' | 'empresa';
  subrole?: 'gestor' | 'operador' | 'fiscal'; // null para empresas
  regional_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Regional {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  responsible: string;
  created_at: string;
  updated_at: string;
}

export interface Bairro {
  id: string;
  name: string;
  code: string;
  regional_id: string;
  regional?: Regional;
  created_at: string;
  updated_at: string;
}

export interface Territorio {
  id: string;
  name: string;
  code: string;
  bairro_id: string;
  bairro?: Bairro;
  created_at: string;
  updated_at: string;
}

export interface Fiscal {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  regional_id: string;
  regional?: Regional;
  created_at: string;
  updated_at: string;
}

export interface ZGL {
  id: string;
  name: string;
  code: string;
  territory_id: string;
  territorio?: Territorio;
  created_at: string;
  updated_at: string;
}

export interface EquipamentoPublico {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  bairro_id: string;
  bairro?: Bairro;
  regional_id: string;
  regional?: Regional;
  created_at: string;
  updated_at: string;
}

export interface EmpresaContratada {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  responsible: string;
  created_at: string;
  updated_at: string;
}

export interface Equipe {
  id: string;
  name: string;
  type: string;
  capacity: number;
  empresa_id: string;
  empresa?: EmpresaContratada;
  created_at: string;
  updated_at: string;
}

export interface Ocorrencia {
  id: string;
  protocol: string;
  description: string;
  service_type: string;
  public_equipment_name: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'criada' | 'encaminhada' | 'autorizada' | 'cancelada' | 'devolvida' | 'em_analise' | 'agendada' | 'em_execucao' | 'concluida' | 'executada';
  
  // Campos atualizados RF010
  occurrence_date?: string;
  occurrence_type?: string;
  origin?: string;
  origin_number?: string;
  
  // Localização
  address: string;
  latitude?: number;
  longitude?: number;
  equipamento_id?: string;
  equipamento?: EquipamentoPublico;
  
  // Responsabilidades
  regional_id: string;
  regional?: Regional;
  fiscal_id: string;
  fiscal?: Fiscal;
  
  // Campos de aprovação CEGOR
  approved_by?: string;
  approved_at?: string;
  cancel_reason?: string;
  
  // Campos de aprovação Regional (v1.3)
  approved_by_regional?: string;
  approved_at_regional?: string;
  forwarded_by?: string;
  forwarded_at?: string;
  
  // Agendamento
  scheduled_date?: string;
  scheduled_time?: string;
  estimated_hours?: number;
  
  // Execução
  empresa_id?: string;
  empresa?: EmpresaContratada;
  equipe_id?: string;
  equipe?: Equipe;
  started_at?: string;
  completed_at?: string;
  actual_hours?: number;
  execution_notes?: string;
  company_confirmed?: boolean; // Para empresa confirmar conclusão
  
  created_at: string;
  updated_at: string;
}

export interface BusinessRule {
  id: string;
  code: string;
  description: string;
}

export type OccurrenceStatus = 'criada' | 'encaminhada' | 'autorizada' | 'cancelada' | 'devolvida' | 'em_analise' | 'agendada' | 'em_execucao' | 'concluida';
export type Priority = 'baixa' | 'media' | 'alta';
export type UserRole = 'cegor' | 'regional' | 'empresa';
export type UserSubrole = 'gestor' | 'operador' | 'fiscal';

// Funções auxiliares para verificar permissões - com null checks
export const isRegionalGestor = (user: User | null) => user?.role === 'regional' && user?.subrole === 'gestor';
export const isRegionalOperador = (user: User | null) => user?.role === 'regional' && user?.subrole === 'operador';
export const isRegionalFiscal = (user: User | null) => user?.role === 'regional' && user?.subrole === 'fiscal';
export const isCegorGestor = (user: User | null) => user?.role === 'cegor' && user?.subrole === 'gestor';
export const isCegorOperador = (user: User | null) => user?.role === 'cegor' && user?.subrole === 'operador';
export const isCegorFiscal = (user: User | null) => user?.role === 'cegor' && user?.subrole === 'fiscal';
