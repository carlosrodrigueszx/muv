import { useEffect, useState } from "react";
import {
  AccountNavbar,
  HistoryDetails,
  HistoryFilters,
  HistoryList,
  localFreightHistoryService,
  type FreightHistoryFilters,
  type FreightHistoryRecord,
} from "../features/freight-history";

const initialFilters: FreightHistoryFilters = {
  profile: "cliente",
  modality: "todas",
  status: "todas",
  month: "2026-11",
};

export default function FreightHistory() {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [records, setRecords] = useState<FreightHistoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void localFreightHistoryService.list(appliedFilters).then((result) => {
      if (!active) return;

      setRecords(result);
      setSelectedId((current) =>
        result.some((record) => record.id === current) ? current : (result[0]?.id ?? null),
      );
    });

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  const selectedRecord = records.find((record) => record.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#F4F7F8] text-slate-900 antialiased">
      <AccountNavbar />
      <main className="mx-auto max-w-[1440px] px-5 pb-10 pt-28 sm:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-wide text-[#176A5B]">RF014 / MUV</p>
        <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-[#203139] sm:text-[34px]">
          Seu histórico de fretes
        </h1>
        <p className="mt-5 text-sm text-slate-500">
          Consulte solicitações, propostas e serviços da sua conta — como cliente ou prestador.
        </p>

        <div className="mt-7 space-y-6">
          <HistoryFilters
            filters={draftFilters}
            onChange={setDraftFilters}
            onSubmit={() => setAppliedFilters(draftFilters)}
          />
          <HistoryList records={records} selectedId={selectedId} onSelect={(record) => setSelectedId(record.id)} />
          <HistoryDetails record={selectedRecord} />
        </div>

        
      </main>
    </div>
  );
}
