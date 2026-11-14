export type AccountProfile = "cliente" | "prestador";
export type FreightModality = "Encomendas" | "Pessoas";

export type FreightStatus =
  | "Contratado"
  | "Concluído"
  | "Cancelado"
  | "Encerrado sem conclusão"
  | "Proposta enviada";

export interface FreightProposal {
  id: string;
  provider: string;
  amount: string;
  status: "Aceita" | "Encerrada";
}

export interface FreightTimelineEvent {
  date: string;
  time: string;
  title: string;
  description: string;
}

export interface FreightHistoryRecord {
  id: string;
  modality: FreightModality;
  origin: string;
  destination: string;
  displayDate: string;
  month: string;
  agreedValue: string;
  status: FreightStatus;
  visibleTo: AccountProfile[];
  request: {
    openedAt: string;
    requestedBy: string;
    summary: string;
    preservedConditions: string;
  };
  proposals: FreightProposal[];
  timeline: FreightTimelineEvent[];
}

export interface FreightHistoryFilters {
  profile: AccountProfile;
  modality: FreightModality | "todas";
  status: FreightStatus | "todas";
  month: string;
}
