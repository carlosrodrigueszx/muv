import type { FreightHistoryRecord } from "../types";

interface HistoryDetailsProps {
  record: FreightHistoryRecord | null;
}

export function HistoryDetails({ record }: HistoryDetailsProps) {
  return (
    <section id="freight-details" className="grid scroll-mt-28 grid-cols-1 gap-5 lg:grid-cols-2">
      <article className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">
          {record ? `${record.id} · ` : ""}Solicitação e propostas
        </h2>
        {record ? (
          <>
            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              Solicitação aberta em {record.request.openedAt} por {record.request.requestedBy}.<br />
              {record.request.summary} · {record.origin} → {record.destination}
            </p>

            <div className="mt-4 space-y-1 text-sm text-slate-700">
              {record.proposals.length > 0 ? (
                record.proposals.map((proposal) => (
                  <p key={proposal.id}>
                    {proposal.id} · {proposal.provider} · {proposal.amount} — {proposal.status}
                  </p>
                ))
              ) : (
                <p>Nenhuma proposta vinculada a esta solicitação.</p>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-[#E2F1ED] p-4 text-sm text-slate-700">
              <h3 className="font-bold text-[#15584D]">Condições preservadas</h3>
              <p className="mt-1 leading-relaxed">{record.request.preservedConditions}</p>
            </div>
          </>
        ) : (
          <p className="mt-5 rounded-xl bg-[#F4F6F7] p-5 text-sm text-slate-500">
            Nenhuma solicitação ou proposta disponível.
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">
          {record ? `${record.id} · ` : ""}Linha do tempo
        </h2>
        {record && record.timeline.length > 0 ? (
          <div className="mt-5 space-y-3">
            {record.timeline.map((event) => (
              <div key={`${event.date}-${event.time}-${event.title}`} className="rounded-xl bg-[#F4F6F7] p-4">
                <p className="text-[11px] font-bold text-[#176A5B]">{event.date} · {event.time}</p>
                <h3 className="mt-1 text-sm font-bold text-slate-800">{event.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl bg-[#F4F6F7] p-5 text-sm text-slate-500">
            Nenhum evento registrado na linha do tempo.
          </p>
        )}
      </article>
    </section>
  );
}
