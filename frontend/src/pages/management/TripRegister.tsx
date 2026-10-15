import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Driver = { id: number; nome: string };
const today = new Date().toISOString().slice(0, 10);

export default function TripRegister() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverError, setDriverError] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({
    motoristaId: "", nomeRota: "", origem: "", paradaIntermediaria: "", destino: "",
    data: today, horarioPartida: "14:30", horarioChegada: "15:30", tarifa: "",
    vagas: "", tipoVeiculo: "VAN", modeloVeiculo: "", anoVeiculo: String(new Date().getFullYear()),
    corVeiculo: "", placaVeiculo: "", capacidadeVeiculo: "", aceitaBagagem: true,
    arCondicionado: true, wifi: false,
  });

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const response = await fetch("/api/motoristas", { credentials: "same-origin" });
        if (!response.ok) throw new Error();
        setDrivers(await response.json());
      } catch {
        setDriverError("Não foi possível carregar os motoristas. Confira se a API está ativa.");
      }
    };
    void loadDrivers();
  }, []);

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm(current => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback("");
    const payload = {
      ...form,
      motoristaId: Number(form.motoristaId),
      tarifa: Number(form.tarifa),
      vagas: Number(form.vagas),
      anoVeiculo: Number(form.anoVeiculo),
      capacidadeVeiculo: Number(form.capacidadeVeiculo),
      paradaIntermediaria: form.paradaIntermediaria.trim() || null,
      placaVeiculo: form.placaVeiculo.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    };
    try {
      const csrfResponse = await fetch("/api/auth/csrf", { credentials: "same-origin" });
      if (!csrfResponse.ok) throw new Error("Não foi possível iniciar a sessão segura. Atualize a página e tente novamente.");
      const csrf: { headerName: string; token: string } = await csrfResponse.json();
      const response = await fetch("/api/viagens", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Entre na sua conta em /login antes de cadastrar uma viagem.");
        if (response.status === 403) throw new Error("Sua sessão de segurança expirou. Atualize a página e tente novamente.");
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail || body?.message || "Não foi possível cadastrar a viagem.");
      }
      const result: { id: number } = await response.json();
      setFeedback(`Viagem #${result.id} cadastrada. Ela já está disponível na busca.`);
      setForm(current => ({ ...current, nomeRota: "", paradaIntermediaria: "", tarifa: "", vagas: "", modeloVeiculo: "", corVeiculo: "", placaVeiculo: "", capacidadeVeiculo: "" }));
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao cadastrar a viagem.");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "mt-1 w-full rounded-lg border border-gray-300 bg-secondary-gray p-2.5 text-sm";
  const labelClass = "block text-sm font-medium text-slate-700";

  return <section className="w-full max-w-5xl">
    <div className="mb-5"><h1 className="text-3xl font-semibold text-primary">Cadastrar viagem</h1><p className="mt-1 text-sm text-slate-600">Cadastre a viagem, seu veículo e os pontos da rota.</p></div>
    {feedback && <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">{feedback}</p>}
    {driverError && <p role="alert" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{driverError}</p>}
    {!driverError && drivers.length === 0 && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Cadastre um motorista antes de criar uma viagem.</p>}
    <form onSubmit={submit} className="space-y-5 rounded-xl bg-white p-5 shadow-sm md:p-6">
      <fieldset className="grid gap-4 border-b border-slate-100 pb-5 md:grid-cols-2">
        <legend className="mb-3 font-semibold text-primary">Rota e horários</legend>
        <label className={labelClass}>Nome da linha<input className={fieldClass} required maxLength={255} value={form.nomeRota} onChange={e => update("nomeRota", e.target.value)} placeholder="Ex.: Linha 101 Direta" /></label>
        <label className={labelClass}>Motorista<select className={fieldClass} required value={form.motoristaId} onChange={e => update("motoristaId", e.target.value)}><option value="">Selecione um motorista</option>{drivers.map(driver => <option key={driver.id} value={driver.id}>{driver.nome}</option>)}</select></label>
        <label className={labelClass}>Origem<input className={fieldClass} required maxLength={255} value={form.origem} onChange={e => update("origem", e.target.value)} placeholder="Cidade ou terminal" /></label>
        <label className={labelClass}>Parada intermediária (opcional)<input className={fieldClass} maxLength={255} value={form.paradaIntermediaria} onChange={e => update("paradaIntermediaria", e.target.value)} /></label>
        <label className={labelClass}>Destino<input className={fieldClass} required maxLength={255} value={form.destino} onChange={e => update("destino", e.target.value)} placeholder="Cidade ou terminal" /></label>
        <label className={labelClass}>Data<input className={fieldClass} required type="date" min={today} value={form.data} onChange={e => update("data", e.target.value)} /></label>
        <label className={labelClass}>Horário de partida<input className={fieldClass} required type="time" value={form.horarioPartida} onChange={e => update("horarioPartida", e.target.value)} /></label>
        <label className={labelClass}>Horário previsto de chegada<input className={fieldClass} required type="time" value={form.horarioChegada} onChange={e => update("horarioChegada", e.target.value)} /></label>
        <label className={labelClass}>Tarifa por passageiro (R$)<input className={fieldClass} required type="number" min="0.01" step="0.01" value={form.tarifa} onChange={e => update("tarifa", e.target.value)} /></label>
        <label className={labelClass}>Vagas disponíveis<input className={fieldClass} required type="number" min="1" step="1" value={form.vagas} onChange={e => update("vagas", e.target.value)} /></label>
      </fieldset>
      <fieldset className="grid gap-4 border-b border-slate-100 pb-5 md:grid-cols-3">
        <legend className="mb-3 font-semibold text-primary">Veículo</legend>
        <label className={labelClass}>Tipo<input className={fieldClass} required maxLength={32} value={form.tipoVeiculo} onChange={e => update("tipoVeiculo", e.target.value)} /></label>
        <label className={labelClass}>Modelo<input className={fieldClass} required maxLength={64} value={form.modeloVeiculo} onChange={e => update("modeloVeiculo", e.target.value)} /></label>
        <label className={labelClass}>Ano<input className={fieldClass} required type="number" min="1900" max="2100" value={form.anoVeiculo} onChange={e => update("anoVeiculo", e.target.value)} /></label>
        <label className={labelClass}>Cor<input className={fieldClass} required maxLength={32} value={form.corVeiculo} onChange={e => update("corVeiculo", e.target.value)} /></label>
        <label className={labelClass}>Placa (7 caracteres)<input className={fieldClass} required minLength={7} maxLength={7} pattern="[A-Za-z0-9]{7}" value={form.placaVeiculo} onChange={e => update("placaVeiculo", e.target.value.toUpperCase())} /></label>
        <label className={labelClass}>Capacidade total<input className={fieldClass} required type="number" min="1" step="1" value={form.capacidadeVeiculo} onChange={e => update("capacidadeVeiculo", e.target.value)} /></label>
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:col-span-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.aceitaBagagem} onChange={e => update("aceitaBagagem", e.target.checked)} /> Aceita bagagem</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.arCondicionado} onChange={e => update("arCondicionado", e.target.checked)} /> Ar-condicionado</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.wifi} onChange={e => update("wifi", e.target.checked)} /> Wi-Fi</label>
        </div>
      </fieldset>
      <button disabled={saving || drivers.length === 0} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" type="submit">{saving ? "Salvando…" : "Cadastrar viagem"}</button>
    </form>
  </section>;
}
