import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { FaBus, FaRoute, FaUserTie } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { LuArrowLeft, LuCalendarDays, LuClock3, LuMapPin, LuUsers } from "react-icons/lu";

interface PontoRota {
  id?: number;
  ordem?: number;
  nomePonto: string;
  endereco?: string;
}

interface Viagem {
  id: number;
  dataViagem: string;
  horarioPartida: string;
  horarioChegada: string;
  vagasRestantes: number;
  rota: { id?: number; nome: string; descricao?: string; pontos?: PontoRota[] };
  veiculo: {
    tipo: string;
    modelo: string;
    ano: number;
    cor: string;
    placa: string;
    fotos?: string[];
    capacidadeTotalPassageiros: number;
    aceitaBagagem: boolean;
    arCondicionado: boolean;
    wifi: boolean;
  };
  motorista: { nome: string };
}

const apiUrl = "http://localhost:8080/api/viagens";

function formatDate(value: string) {
  if (!value) return "Data não informada";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function ViagemDetalhe({ viagem }: { viagem: Viagem }) {
  const photo = viagem.veiculo?.fotos?.[0];

  return (
    <>
      <Link to="/gestao/viagens" className="flex w-fit items-center gap-2 text-primary font-semibold hover:underline">
        <LuArrowLeft /> Voltar para viagens
      </Link>
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary-dark-gray">Detalhes da viagem</p>
        <h1 className="text-3xl font-semibold text-primary">{viagem.rota?.nome ?? `Viagem #${viagem.id}`}</h1>
      </header>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-lg bg-primary p-2 text-white"><FaRoute size={20} /></span>
            <h2 className="text-xl font-semibold text-primary">Informações da viagem</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Info icon={<LuCalendarDays />} label="Data" value={formatDate(viagem.dataViagem)} />
            <Info icon={<LuClock3 />} label="Horário de partida" value={viagem.horarioPartida?.slice(0, 5) ?? "—"} />
            <Info icon={<LuClock3 />} label="Horário previsto de chegada" value={viagem.horarioChegada?.slice(0, 5) ?? "—"} />
            <Info icon={<LuUsers />} label="Vagas restantes" value={String(viagem.vagasRestantes ?? 0)} />
            <Info icon={<FaUserTie />} label="Motorista" value={viagem.motorista?.nome ?? "Não informado"} />
          </div>
          {viagem.rota?.descricao && <p className="mt-5 text-secondary-dark-gray">{viagem.rota.descricao}</p>}
          {!!viagem.rota?.pontos?.length && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-primary">Paradas da rota</h3>
              <ol className="space-y-3">
                {viagem.rota.pontos.map((ponto, index) => (
                  <li key={ponto.id ?? `${ponto.nomePonto}-${index}`} className="flex gap-3">
                    <LuMapPin className="mt-1 shrink-0 text-primary" />
                    <div><p className="font-medium">{ponto.nomePonto}</p>{ponto.endereco && <p className="text-sm text-secondary-dark-gray">{ponto.endereco}</p>}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>

        <article className="overflow-hidden rounded-xl bg-white shadow-md">
          {photo ? <img src={photo} alt={`${viagem.veiculo?.modelo ?? "Veículo"}`} className="h-56 w-full object-cover" /> :
            <div className="flex h-56 items-center justify-center bg-secondary-gray text-primary"><FaBus size={64} /></div>}
          <div className="p-6">
            <h2 className="mb-5 text-xl font-semibold text-primary">Detalhes do veículo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Tipo" value={viagem.veiculo?.tipo ?? "—"} />
              <Info label="Modelo" value={viagem.veiculo?.modelo ?? "—"} />
              <Info label="Ano / cor" value={`${viagem.veiculo?.ano ?? "—"} · ${viagem.veiculo?.cor ?? "—"}`} />
              <Info label="Placa" value={viagem.veiculo?.placa ?? "—"} />
              <Info label="Capacidade" value={`${viagem.veiculo?.capacidadeTotalPassageiros ?? "—"} passageiros`} />
              <Info label="Bagagem" value={viagem.veiculo?.aceitaBagagem ? "Permitida" : "Não permitida"} />
              <Info label="Ar-condicionado" value={viagem.veiculo?.arCondicionado ? "Sim" : "Não"} />
              <Info label="Wi-Fi" value={viagem.veiculo?.wifi ? "Sim" : "Não"} />
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function Info({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return <div><p className="mb-1 flex items-center gap-2 text-sm text-secondary-dark-gray">{icon}{label}</p><p className="font-medium text-gray-900">{value}</p></div>;
}

export default function Viagens() {
  const { id } = useParams();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [selected, setSelected] = useState<Viagem | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const url = id ? `${apiUrl}/${id}` : apiUrl;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "Viagem não encontrada." : "Não foi possível carregar as viagens.");
        return response.json();
      })
      .then((data: Viagem | Viagem[]) => {
        if (!active) return;
        if (id) setSelected(data as Viagem);
        else setViagens(Array.isArray(data) ? data : []);
      })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Erro ao carregar os dados."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const filtered = useMemo(() => viagens.filter((viagem) =>
    `${viagem.rota?.nome ?? ""} ${viagem.veiculo?.modelo ?? ""} ${viagem.motorista?.nome ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  ), [viagens, search]);

  if (id && selected) return <ViagemDetalhe viagem={selected} />;
  if (id) return <><Link to="/gestao/viagens" className="flex w-fit items-center gap-2 text-primary"><LuArrowLeft /> Voltar para viagens</Link><PageMessage loading={loading} error={error} /></>;

  return (
    <>
      <header><p className="text-sm font-semibold uppercase tracking-wide text-secondary-dark-gray">Operação</p><h1 className="text-3xl font-semibold text-primary">Viagens</h1><p className="mt-1 text-secondary-dark-gray">Consulte os horários, rotas e veículos disponíveis.</p></header>
      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-primary">Viagens cadastradas</h2>
        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-secondary-gray px-3 py-2 sm:w-80">
          <IoSearch className="text-secondary-dark-gray" /><span className="sr-only">Buscar viagens</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por rota, veículo ou motorista" className="w-full bg-transparent outline-none" />
        </label>
      </div>
      {loading || error ? <PageMessage loading={loading} error={error} /> : filtered.length === 0 ?
        <div className="rounded-xl bg-white p-8 text-center text-secondary-dark-gray shadow-md">{viagens.length ? "Nenhuma viagem corresponde à busca." : "Nenhuma viagem cadastrada."}</div> :
        <div className="overflow-x-auto rounded-xl bg-white shadow-md">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-secondary-gray text-sm text-secondary-dark-gray"><tr><th className="px-5 py-4">Rota</th><th className="px-5 py-4">Data e horário</th><th className="px-5 py-4">Veículo</th><th className="px-5 py-4">Vagas</th><th className="px-5 py-4"><span className="sr-only">Ações</span></th></tr></thead>
            <tbody>{filtered.map((viagem) => <tr key={viagem.id} className="border-t border-gray-200">
              <td className="px-5 py-4 font-semibold">{viagem.rota?.nome ?? "Rota não informada"}</td>
              <td className="px-5 py-4">{formatDate(viagem.dataViagem)} · {viagem.horarioPartida?.slice(0, 5) ?? "—"}</td>
              <td className="px-5 py-4">{viagem.veiculo?.modelo ?? "Não informado"}</td>
              <td className="px-5 py-4">{viagem.vagasRestantes ?? 0}</td>
              <td className="px-5 py-4"><Link to={`/gestao/viagens/${viagem.id}`} className="font-semibold text-primary hover:underline">Ver detalhes</Link></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </>
  );
}

function PageMessage({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <p className="rounded-xl bg-white p-8 text-center text-secondary-dark-gray shadow-md">Carregando viagens…</p>;
  if (error) return <p role="alert" className="rounded-xl bg-white p-8 text-center text-red-700 shadow-md">{error} Confira se o servidor está disponível.</p>;
  return null;
}
