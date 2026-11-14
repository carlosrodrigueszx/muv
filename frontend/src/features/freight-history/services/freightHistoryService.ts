import type { FreightHistoryFilters, FreightHistoryRecord } from "../types";

export interface FreightHistoryService {
  list(filters: FreightHistoryFilters): Promise<FreightHistoryRecord[]>;
}

// Esta implementação local mantém a mesma interface que será usada pelo cliente HTTP.
// Quando a API estiver disponível, substitua apenas o serviço injetado na página.
export const localFreightHistoryService: FreightHistoryService = {
  async list() {
    return [];
  },
};
