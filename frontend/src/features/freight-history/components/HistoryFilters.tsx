import type { FreightHistoryFilters } from "../types";

interface HistoryFiltersProps {
  filters: FreightHistoryFilters;
  onChange: (filters: FreightHistoryFilters) => void;
  onSubmit: () => void;
}

const fieldClassName =
  "h-12 w-full rounded-lg border border-slate-200 bg-[#F4F6F7] px-3 text-sm text-slate-700 outline-none transition focus:border-[#176A5B] focus:ring-2 focus:ring-[#176A5B]/10";

export function HistoryFilters({ filters, onChange, onSubmit }: HistoryFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="mb-5 text-lg font-bold text-slate-800">Encontre um registro</h2>
      <form
        className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="space-y-2 text-xs font-semibold text-slate-500">
          <span>Perfil</span>
          <select
            className={fieldClassName}
            value={filters.profile}
            onChange={(event) => onChange({ ...filters, profile: event.target.value as FreightHistoryFilters["profile"] })}
          >
            <option value="cliente">Cliente</option>
            <option value="prestador">Prestador</option>
          </select>
        </label>

        <label className="space-y-2 text-xs font-semibold text-slate-500">
          <span>Modalidade</span>
          <select
            className={fieldClassName}
            value={filters.modality}
            onChange={(event) => onChange({ ...filters, modality: event.target.value as FreightHistoryFilters["modality"] })}
          >
            <option value="todas">Todas</option>
            <option value="Encomendas">Encomendas</option>
            <option value="Pessoas">Pessoas</option>
          </select>
        </label>

        <label className="space-y-2 text-xs font-semibold text-slate-500">
          <span>Situação</span>
          <select
            className={fieldClassName}
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as FreightHistoryFilters["status"] })}
          >
            <option value="todas">Todas</option>
            <option value="Contratado">Contratado</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Encerrado sem conclusão">Encerrado sem conclusão</option>
            <option value="Proposta enviada">Proposta enviada</option>
          </select>
        </label>

        <label className="space-y-2 text-xs font-semibold text-slate-500">
          <span>Período</span>
          <select
            className={fieldClassName}
            value={filters.month}
            onChange={(event) => onChange({ ...filters, month: event.target.value })}
          >
            <option value="2026-11">Novembro de 2026</option>
            <option value="2026-10">Outubro de 2026</option>
          </select>
        </label>

        <button
          type="submit"
          className="h-11 rounded-lg bg-[#176A5B] px-5 text-sm font-bold text-white transition hover:bg-[#115448] sm:col-span-2 lg:col-span-1"
        >
          Filtrar
        </button>
      </form>
    </section>
  );
}
