import { useState } from "react";
import type { FormEvent } from "react";
import { FaBus, FaCalendarDays, FaChair, FaCircleUser, FaLocationDot, FaShieldHalved, FaSliders, FaSnowflake, FaWifi } from "react-icons/fa6";
import { LuArrowRight, LuBadgeCheck, LuCircleHelp, LuClock3, LuMapPin } from "react-icons/lu";
import "./TripSearch.css";

type Trip = {
  id: number; data: string; partida: string; chegada?: string; origem: string; destino: string;
  via?: string; motorista: string; avaliacao?: number; veiculo: string; linha: string;
  tarifa: number; vagas: number; arCondicionado: boolean; wifi: boolean;
};

const today = new Date().toISOString().slice(0, 10);
const time = (value?: string) => value?.slice(0, 5) ?? "—";
const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function TripSearch() {
  const [origem, setOrigem] = useState("Fortaleza (Terminal Messejana)");
  const [destino, setDestino] = useState("Pacajus (Centro / Rodoviária)");
  const [data, setData] = useState(today);
  const [arCondicionado, setArCondicionado] = useState(true);
  const [wifi, setWifi] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ origem, destino, data, arCondicionado: String(arCondicionado), wifi: String(wifi) });
    try {
      const response = await fetch(`/api/viagens/consulta?${query}`);
      if (!response.ok) throw new Error("Não foi possível consultar as viagens.");
      setTrips(await response.json());
    } catch {
      setTrips([]);
      setError("Não foi possível conectar à API. Confira se o back-end e o banco estão em execução.");
    } finally { setLoading(false); }
  }

  return <div className="trip-page">
    <header className="trip-header">
      <a href="/buscar-viagens" className="trip-brand"><span className="trip-brand-icon"><FaBus /></span><b>MUV</b></a>
      <nav className="trip-nav"><a href="/">Início</a><a className="active" href="/buscar-viagens">Buscar Viagens</a><a href="#minhas-viagens">Minhas Viagens</a></nav>
      <button className="trip-profile" aria-label="Perfil"><FaCircleUser /></button>
    </header>
    <main className="trip-main">
      <form className="trip-search-panel" onSubmit={search}>
        <div className="trip-search-row">
          <label className="trip-search-field"><span><LuMapPin /> Origem</span><input value={origem} onChange={e => setOrigem(e.target.value)} required /></label>
          <span className="trip-swap"><LuArrowRight /></span>
          <label className="trip-search-field"><span><FaLocationDot /> Destino</span><input value={destino} onChange={e => setDestino(e.target.value)} required /></label>
          <label className="trip-search-field trip-date-field"><span><FaCalendarDays /> Data da Viagem</span><input type="date" value={data} onChange={e => setData(e.target.value)} /></label>
          <button className="trip-filter-button" type="submit"><FaSliders /> Filtrar Busca</button>
        </div>
        <div className="trip-quick-filters"><span>Filtros Rápidos:</span>
          <label className={arCondicionado ? "quick-filter selected" : "quick-filter"}><input type="checkbox" checked={arCondicionado} onChange={e => setArCondicionado(e.target.checked)} /><FaSnowflake /> Ar-condicionado</label>
          <label className={wifi ? "quick-filter selected" : "quick-filter"}><input type="checkbox" checked={wifi} onChange={e => setWifi(e.target.checked)} /><FaWifi /> Wi-Fi</label>
        </div>
      </form>
      <div className="trip-results-heading"><h1>{trips.length} opções disponíveis <span>para {origem.split(" (")[0]} → {destino.split(" (")[0]}</span></h1><p><LuClock3 /> Tarifas congeladas por 15 minutos</p></div>
      <section className="trip-results">
        {error && <div role="alert" className="trip-empty trip-error">{error}</div>}
        {!error && !loading && trips.length === 0 && <div className="trip-empty">Nenhuma viagem encontrada para esses critérios. Tente outras cidades ou data.</div>}
        {trips.map(trip => <article key={trip.id} className="trip-card">
          <div className="trip-card-main">
            <div className="trip-tags"><span className="trip-line-tag">{trip.linha}</span><span><FaBus /> {trip.veiculo}</span>{trip.via ? <span>{trip.via}</span> : <span>Sem Paradas</span>}</div>
            <div className="trip-route">
              <div className="trip-stop"><strong>{time(trip.partida)}</strong><span>{trip.origem}</span></div>
              <div className="trip-route-line"><span>{trip.chegada ? "60 min" : "Direto"}</span><i /><b /><small>{trip.via || "Via BR-116 Express"}</small></div>
              <div className="trip-stop destination"><strong>{time(trip.chegada)}</strong><span>{trip.destino}</span></div>
            </div>
            <div className="trip-meta"><span><i className="avatar">{trip.motorista.slice(0, 1)}</i>{trip.motorista}</span>{trip.avaliacao != null && <span className="rating">★ {trip.avaliacao.toFixed(1)}</span>}<span className="seats"><FaChair /> {trip.vagas} vagas livres</span>{trip.arCondicionado && <span><FaSnowflake /> Ar Climatizado</span>}{trip.wifi && <span><FaWifi /> Wi-Fi a bordo</span>}</div>
          </div>
          <div className="trip-card-price"><span>Passagem individual</span><strong>{money(trip.tarifa)}</strong><button type="button" disabled title="Seleção de assento disponível em uma próxima etapa">Selecionar e Escolher Assento <LuArrowRight /></button></div>
        </article>)}
      </section>
      <aside className="trip-safe"><span className="safe-icon"><FaShieldHalved /></span><div><b>Viagens homologadas e seguras</b><p>Cooperativa vinculada à ARCE. Embarque com QR Code digital no smartphone.</p></div><a href="#duvidas">Dúvidas sobre embarque? <LuCircleHelp /></a></aside>
    </main>
    <footer className="trip-footer">
      <div className="trip-footer-columns">
        <section><b className="footer-brand">MUV <small>REGIONAL</small></b><p>Conectando municípios, cooperativas de transporte e passageiros com segurança e previsibilidade operacional.</p></section>
        <section><b>Regulamentação &amp; Órgãos</b><p><LuBadgeCheck /> Certificação ANTT Nacional<br /><LuBadgeCheck /> Concessão ARCE Estadual<br /><LuBadgeCheck /> Normas de Mobilidade Urbana</p></section>
        <section><b>Privacidade &amp; Conformidade</b><p>Diretrizes de LGPD<br />Termos de Uso e Bilhetagem<br />Seguro de Viagem Obrigatório</p></section>
        <section><b>Suporte &amp; Emergência 24h</b><p className="support"><strong>✱ 0800 488 9000</strong><br />Central de Ocorrências e Monitoramento Operacional</p></section>
      </div>
      <div className="trip-footer-bottom"><span>© 2024 MUV Tecnologia em Transporte Regional S.A. Todos os direitos reservados.</span><span>● ANTT Nº 14.892/2023&nbsp;&nbsp; ARCE Linha Certificada</span></div>
    </footer>
  </div>;
}
