import { LuArrowRight } from "react-icons/lu";
import type { FreightHistoryRecord } from "../types";

interface HistoryListProps {
  records: FreightHistoryRecord[];
  selectedId: string | null;
  onSelect: (record: FreightHistoryRecord) => void;
}

export function HistoryList({ records, selectedId, onSelect }: HistoryListProps) {
  const selectedRecord = records.find((record) => record.id === selectedId);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <h2 className="mb-5 text-lg font-bold text-slate-800">
        {records.length} {records.length === 1 ? "registro encontrado" : "registros encontrados"}
      </h2>

      {records.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
          Nenhum frete foi encontrado com os filtros selecionados.
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-5 gap-4 px-3 pb-3 text-[11px] font-bold text-slate-500 md:grid">
            <span>Solicitação / Modalidade</span>
            <span>Origem → Destino</span>
            <span>Data</span>
            <span>Valor acordado</span>
            <span>Situação</span>
          </div>

          <div className="space-y-2.5">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                aria-pressed={selectedId === record.id}
                onClick={() => onSelect(record)}
                className={`grid w-full grid-cols-1 gap-2 rounded-xl border px-3 py-3 text-left text-sm transition md:grid-cols-5 md:items-center md:gap-4 md:border-transparent ${
                  selectedId === record.id
                    ? "border-[#176A5B]/30 bg-[#EDF5F3]"
                    : "border-transparent bg-[#F4F6F7] hover:bg-slate-100"
                }`}
              >
                <span className="font-medium text-slate-700 md:font-normal">{record.id} · {record.modality}</span>
                <span className="flex items-center gap-1 text-slate-700">
                  {record.origin} <LuArrowRight size={13} /> {record.destination}
                </span>
                <span className="text-slate-700">{record.displayDate}</span>
                <span className="text-slate-700">{record.agreedValue}</span>
                <span className="font-semibold text-[#176A5B]">{record.status}</span>
              </button>
            ))}
          </div>

          {selectedRecord && (
            <button
              type="button"
              onClick={() => document.getElementById("freight-details")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#176A5B] transition hover:bg-slate-50"
            >
              Ver detalhes de {selectedRecord.id}
            </button>
          )}
        </>
      )}
    </section>
  );
}
