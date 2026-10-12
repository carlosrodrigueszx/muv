import { useEffect, useState } from "react";

interface PontoRota {
  id: number;
  ordem: number;
  nome: string;
  endereco: string | null;
}

interface Viagem {
  id: number;
  dataViagem: string;
  horarioPartida: string;
  vagasRestantes: number;
  motorista: string;
  rota: { id: number; nome: string; descricao: string | null; pontos: PontoRota[] };
  veiculo: {
    id: number;
    tipo: string;
    modelo: string;
    ano: number;
    cor: string;
    placa: string;
    capacidadeTotalPassageiros: number;
    aceitaBagagem: boolean;
  };
}

const API_URL = "http://localhost:8080/api/viagens";

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(`${data}T00:00:00`),
  );
}

export default function Trips() {
  const [trips, setTrips] = useState<Viagem[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Viagem | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar as viagens.");
        return response.json() as Promise<Viagem[]>;
      })
      .then(setTrips)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoadingList(false));
  }, []);

  async function showDetails(id: number) {
    setSelectedTrip(null);
    setLoadingDetails(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Não foi possível carregar os detalhes da viagem.");
      setSelectedTrip((await response.json()) as Viagem);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao carregar viagem.");
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <section className="w-full max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-primary">Viagens</h1>
        <p className="mt-1 text-secondary-dark-gray">Consulte os horários, rotas e veículos.</p>
      </header>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          {loadingList && <p>Carregando viagens...</p>}
          {!loadingList && trips.length === 0 && !error && (
            <div className="rounded-xl bg-white p-6 shadow-md">Nenhuma viagem cadastrada.</div>
          )}
          {trips.map((trip) => (
            <article key={trip.id} className="rounded-xl bg-white p-5 shadow-md">
              <p className="text-sm text-secondary-dark-gray">{formatarData(trip.dataViagem)} · {trip.horarioPartida.slice(0, 5)}</p>
              <h2 className="mt-1 text-lg font-semibold text-primary">{trip.rota.nome}</h2>
              <p className="mt-1">Motorista: {trip.motorista}</p>
              <p className="text-sm text-secondary-dark-gray">{trip.veiculo.modelo} · {trip.veiculo.placa}</p>
              <button
                type="button"
                onClick={() => void showDetails(trip.id)}
                className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Ver detalhes
              </button>
            </article>
          ))}
        </div>

        <section aria-live="polite" className="min-h-64 rounded-xl bg-white p-6 shadow-md">
          {loadingDetails && <p>Carregando detalhes...</p>}
          {!loadingDetails && !selectedTrip && <p className="text-secondary-dark-gray">Selecione uma viagem para ver os detalhes do veículo e da rota.</p>}
          {selectedTrip && (
            <>
              <h2 className="text-2xl font-semibold text-primary">Detalhes da viagem</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-sm text-secondary-dark-gray">Data e horário</dt><dd className="font-medium">{formatarData(selectedTrip.dataViagem)} às {selectedTrip.horarioPartida.slice(0, 5)}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Motorista</dt><dd className="font-medium">{selectedTrip.motorista}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Vagas restantes</dt><dd className="font-medium">{selectedTrip.vagasRestantes}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Rota</dt><dd className="font-medium">{selectedTrip.rota.nome}</dd></div>
              </dl>
              {selectedTrip.rota.descricao && <p className="mt-2 text-secondary-dark-gray">{selectedTrip.rota.descricao}</p>}

              <h3 className="mt-6 text-lg font-semibold">Paradas</h3>
              {selectedTrip.rota.pontos.length > 0 ? (
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  {selectedTrip.rota.pontos.map((point) => (
                    <li key={point.id}>{point.nome}{point.endereco ? ` · ${point.endereco}` : ""}</li>
                  ))}
                </ol>
              ) : <p className="mt-2 text-secondary-dark-gray">Esta rota ainda não tem paradas cadastradas.</p>}

              <h3 className="mt-6 text-lg font-semibold">Veículo</h3>
              <dl className="mt-2 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-sm text-secondary-dark-gray">Modelo</dt><dd className="font-medium">{selectedTrip.veiculo.modelo} ({selectedTrip.veiculo.ano})</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Tipo</dt><dd className="font-medium">{selectedTrip.veiculo.tipo}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Placa</dt><dd className="font-medium">{selectedTrip.veiculo.placa}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Cor</dt><dd className="font-medium">{selectedTrip.veiculo.cor}</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Capacidade</dt><dd className="font-medium">{selectedTrip.veiculo.capacidadeTotalPassageiros} passageiros</dd></div>
                <div><dt className="text-sm text-secondary-dark-gray">Bagagem</dt><dd className="font-medium">{selectedTrip.veiculo.aceitaBagagem ? "Permitida" : "Não permitida"}</dd></div>
              </dl>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
