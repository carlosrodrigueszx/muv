import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaBus, FaCalendarDays, FaChair, FaCircleUser, FaSnowflake, FaStar, FaSuitcase, FaWifi } from "react-icons/fa6";
import { LuArrowLeft, LuArrowRight, LuBadgeCheck, LuMapPin, LuShieldCheck } from "react-icons/lu";
import driverFallback from "../../assets/trip-details/driver.png";
import vehicleFront from "../../assets/trip-details/vehicle-front.png";
import vehicleInterior from "../../assets/trip-details/vehicle-interior.png";
import vehicleLateral from "../../assets/trip-details/vehicle-lateral.png";
import vehicleLuggage from "../../assets/trip-details/vehicle-luggage.png";
import "./TripDetails.css";

type Stop = { ordem: number; nome: string; endereco?: string };
type Review = { passageiro: string; nota: number; comentario?: string };
type TripDetailsData = {
  id: number;
  data: string;
  partida: string;
  chegada?: string;
  origem: string;
  destino: string;
  tarifa: number;
  vagas: number;
  linha: string;
  motorista: string;
  fotoMotorista?: string;
  avaliacaoMotorista?: number;
  tipoVeiculo: string;
  modeloVeiculo: string;
  anoVeiculo: number;
  corVeiculo: string;
  placaVeiculo: string;
  capacidadeVeiculo: number;
  aceitaBagagem: boolean;
  arCondicionado: boolean;
  wifi: boolean;
  fotosVeiculo: string[];
  itinerario: Stop[];
  avaliacoes: Review[];
};

const fallbackVehiclePhotos = [vehicleFront, vehicleInterior, vehicleLateral, vehicleLuggage];
const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const date = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
const time = (value?: string) => value?.slice(0, 5) ?? "—";

export default function TripDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState<TripDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadTrip() {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams(location.search);
        const response = await fetch(`/api/viagens/${id}?${query}`, { signal: controller.signal });
        if (response.status === 404) throw new Error("Esta viagem não foi encontrada.");
        if (!response.ok) throw new Error("Não foi possível carregar os detalhes da viagem.");
        setTrip(await response.json() as TripDetailsData);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setTrip(null);
        setError(requestError instanceof Error
          ? requestError.message
          : "Não foi possível conectar à API. Confira se o back-end e o banco estão em execução.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadTrip();
    return () => controller.abort();
  }, [id, location.search]);

  return <div className="trip-page">
    <header className="trip-header">
      <Link to="/buscar-viagens" className="trip-brand"><span className="trip-brand-icon"><FaBus /></span><b>MUV</b></Link>
      <nav className="trip-nav"><Link to="/">Início</Link><Link className="active" to="/buscar-viagens">Buscar Viagens</Link><a href="#minhas-viagens">Minhas Viagens</a><a href="#cooperativas">Cooperativas</a></nav>
      <button className="trip-profile" aria-label="Perfil"><FaCircleUser /></button>
    </header>

    <main className="trip-details-main">
      <Link className="trip-back-link" to="/buscar-viagens"><LuArrowLeft /> Voltar para busca de viagens</Link>
      {loading && <div className="trip-details-message" role="status">Carregando detalhes da viagem…</div>}
      {!loading && error && <div className="trip-details-message trip-details-error" role="alert">{error}</div>}
      {!loading && trip && <>
        <div className="trip-details-toolbar">
          <span><LuShieldCheck /> Viagem cadastrada</span>
          <span><LuBadgeCheck /> Veículo associado</span>
        </div>

        <div className="trip-details-layout">
          <div className="trip-details-content">
            <section className="details-card driver-card">
              <div className="details-section-title"><h1>Motorista da Viagem</h1><span className="verified-badge"><LuBadgeCheck /> Cadastrado</span></div>
              <div className="driver-overview">
                <img className="driver-photo" src={trip.fotoMotorista || driverFallback} alt={`Foto de ${trip.motorista}`} />
                <div className="driver-identity"><h2>{trip.motorista}</h2><p>Motorista vinculado a esta viagem</p><span className="driver-rating"><FaStar /> {trip.avaliacaoMotorista?.toFixed(1) ?? "Sem avaliação"} <small>({trip.avaliacoes.length} avaliações)</small></span></div>
                <div className="driver-checks"><span><LuBadgeCheck /> Cadastro associado à viagem</span>{trip.avaliacaoMotorista != null && <span><LuBadgeCheck /> Avaliação média registrada</span>}</div>
              </div>
              <div className="trip-schedule">
                <h3>Horário de Partida e Chegada</h3>
                <div className="trip-schedule-route">
                  <div><strong>{time(trip.partida)}</strong><span>{trip.origem}</span></div>
                  <div className="schedule-line"><span>{trip.chegada ? `${time(trip.partida)} — ${time(trip.chegada)}` : "Horário previsto"}</span><i /><b /></div>
                  <div className="schedule-destination"><strong>{time(trip.chegada)}</strong><span>{trip.destino}</span></div>
                </div>
                <p className="schedule-date"><FaCalendarDays /> {date(trip.data)} <span>·</span> {trip.linha}</p>
              </div>
            </section>

            <section className="details-card vehicle-card">
              <div className="details-section-title"><h2><FaBus /> Veículo &amp; Comodidades a Bordo</h2><span>{trip.tipoVeiculo}</span></div>
              <div className="vehicle-specs">
                <div><span>MODELO</span><strong>{trip.modeloVeiculo}</strong></div>
                <div><span>ANO / COR</span><strong>{trip.anoVeiculo} · {trip.corVeiculo}</strong></div>
                <div><span>PLACA</span><strong>{trip.placaVeiculo}</strong></div>
                <div><span>CAPACIDADE</span><strong>{trip.capacidadeVeiculo} passageiros</strong></div>
                <div><span>VAGAS DISPONÍVEIS</span><strong>{trip.vagas} lugares</strong></div>
              </div>
              <div className="vehicle-gallery">
                {(trip.fotosVeiculo.length ? trip.fotosVeiculo : fallbackVehiclePhotos).map((photo, index) =>
                  <img key={`${photo}-${index}`} src={photo} alt={`Foto ${index + 1} do veículo ${trip.modeloVeiculo}`} />)}
              </div>
              <h3>Recursos do veículo</h3>
              <div className="vehicle-amenities">
                <span><FaSnowflake /> {trip.arCondicionado ? "Ar-condicionado" : "Sem ar-condicionado"}</span>
                <span><FaWifi /> {trip.wifi ? "Wi-Fi a bordo" : "Sem Wi-Fi"}</span>
                <span><FaSuitcase /> {trip.aceitaBagagem ? "Bagagem permitida" : "Sem bagagem"}</span>
                <span><FaChair /> {trip.vagas} assentos livres</span>
              </div>
            </section>

            <section className="details-card itinerary-card">
              <div className="details-section-title"><h2>Itinerário &amp; Paradas Autorizadas</h2><span>{trip.itinerario.length} paradas</span></div>
              <ol className="itinerary-list">
                {trip.itinerario.map((stop, index) => <li key={`${stop.ordem}-${stop.nome}`} className={index === 0 || index === trip.itinerario.length - 1 ? "route-endpoint" : ""}>
                  <span className="itinerary-marker"><LuMapPin /></span>
                  <div><h3>{stop.nome}</h3><p>{stop.endereco || (index === 0 ? "Ponto de partida" : index === trip.itinerario.length - 1 ? "Destino final" : "Parada autorizada")}</p></div>
                  {index === 0 && <time>{time(trip.partida)} · Partida</time>}
                  {index === trip.itinerario.length - 1 && <time>{time(trip.chegada)} · Chegada</time>}
                </li>)}
              </ol>
            </section>

            <section className="details-card reviews-card">
              <div className="details-section-title"><div><h2>Avaliações de Passageiros</h2><p>Opiniões registradas para esta viagem.</p></div>{trip.avaliacaoMotorista != null && <span className="overall-rating"><FaStar /> {trip.avaliacaoMotorista.toFixed(1)}</span>}</div>
              {trip.avaliacoes.length === 0
                ? <p className="no-reviews">Ainda não há avaliações registradas para esta viagem.</p>
                : <div className="review-list">{trip.avaliacoes.map((review, index) => <article className="review-item" key={`${review.passageiro}-${index}`}>
                  <span className="review-avatar">{review.passageiro.slice(0, 1)}</span>
                  <div><strong>{review.passageiro}</strong><p>{review.comentario || "Avaliação registrada por um passageiro."}</p></div>
                  <span className="review-stars"><FaStar /> {review.nota.toFixed(1)}</span>
                </article>)}</div>}
            </section>
          </div>

          <aside className="trip-details-sidebar">
            <section className="details-card fare-card">
              <span className="fare-label">RESUMO DA VIAGEM</span>
              <span className="fare-route">{trip.origem} <LuArrowRight /> {trip.destino}</span>
              <span className="fare-label">VALOR POR PASSAGEIRO</span>
              <strong className="fare-value">{money(trip.tarifa)}</strong>
              <span className="fare-note">Tarifa referente ao trecho selecionado</span>
              <div className="fare-divider" />
              <p><FaChair /> {trip.vagas} vagas disponíveis</p>
              <p><FaCalendarDays /> {date(trip.data)}</p>
              <button className="trip-continue-button" type="button" disabled title="A reserva estará disponível em uma próxima etapa">Continuar para seleção de assentos <LuArrowRight /></button>
            </section>
            <section className="details-card safety-card">
              <h2><LuShieldCheck /> Viaje com tranquilidade</h2>
              <p>Motorista e veículo cadastrados na plataforma MUV. Confira os detalhes antes de reservar.</p>
              <span><LuBadgeCheck /> Dados da viagem consultados no sistema</span>
            </section>
          </aside>
        </div>
      </>}
    </main>

    <footer className="trip-footer">
      <div className="trip-footer-columns">
        <section><b className="footer-brand">MUV <small>REGIONAL</small></b><p>Conectando municípios, cooperativas de transporte e passageiros com segurança e previsibilidade operacional.</p></section>
        <section><b>Serviços</b><p>Passagens e Viagens<br />Rotas e Paradas<br />Atendimento ao Passageiro</p></section>
        <section><b>Privacidade &amp; Conformidade</b><p>Diretrizes de LGPD<br />Termos de Uso e Bilhetagem<br />Seguro de Viagem Obrigatório</p></section>
        <section><b>Atendimento &amp; Regulamentação</b><p>Suporte ao Passageiro<br />Certificação ANTT Nacional<br />Concessão ARCE Estadual</p></section>
      </div>
      <div className="trip-footer-bottom"><span>© 2024 MUV Tecnologia em Transporte Regional S.A. Todos os direitos reservados.</span><span>● ANTT Nº 14.892/2023&nbsp;&nbsp; ARCE Linha Certificada</span></div>
    </footer>
  </div>;
}
