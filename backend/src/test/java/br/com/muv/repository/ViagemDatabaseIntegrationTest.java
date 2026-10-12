package br.com.muv.repository;

import br.com.muv.model.dto.ViagemCadastroRequestDTO;
import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.service.ViagemCadastroService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=",
        "spring.flyway.enabled=true",
        "spring.jpa.hibernate.ddl-auto=validate"
})
@EnabledIfEnvironmentVariable(named = "IT_DB_URL", matches = ".+")
@Transactional
class ViagemDatabaseIntegrationTest {
    private static final LocalDate DATA = LocalDate.now().plusDays(5);
    private String suffix;
    private Long driverId;
    private String routeName;

    @Autowired JdbcTemplate jdbc;
    @Autowired ViagemConsultaRepository repository;
    @Autowired ViagemCadastroService cadastroService;

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry properties) {
        properties.add("spring.datasource.url", () -> System.getenv("IT_DB_URL"));
        properties.add("spring.datasource.username", () -> System.getenv("IT_DB_USER"));
        properties.add("spring.datasource.password", () -> System.getenv("IT_DB_PASSWORD"));
    }

    @BeforeEach
    void prepareRows() {
        suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        routeName = "IT Route " + suffix;
        driverId = jdbc.queryForObject("""
                INSERT INTO motorista (nome, cpf, cnh, telefone, avaliacao_media, email, senha_hash)
                VALUES (?, ?, ?, ?, 4.5, ?, 'test-only') RETURNING id
                """, Long.class, "Test Driver", "8" + suffix.substring(0, 7) + "000", "7" + suffix.substring(0, 7) + "000",
                "0000000000", "it-" + suffix + "@muv.local");

        Long routeId = jdbc.queryForObject("INSERT INTO rota (nome) VALUES (?) RETURNING id", Long.class, routeName);
        Long originId = jdbc.queryForObject("""
                INSERT INTO ponto_rota (id_rota, ordem, nome_ponto) VALUES (?, 1, ?) RETURNING id
                """, Long.class, routeId, "IT Fortaleza " + suffix);
        Long destinationId = jdbc.queryForObject("""
                INSERT INTO ponto_rota (id_rota, ordem, nome_ponto) VALUES (?, 2, ?) RETURNING id
                """, Long.class, routeId, "IT Pacajus " + suffix);
        jdbc.update("INSERT INTO trecho_rota (id_rota, id_ponto_origem, id_ponto_destino, valor) VALUES (?, ?, ?, ?)",
                routeId, originId, destinationId, new BigDecimal("20.00"));

        addVehicleAndTrip(routeId, "1", true, false, 3);
        addVehicleAndTrip(routeId, "2", false, true, 3);
        addVehicleAndTrip(routeId, "3", true, true, 3);
        addVehicleAndTrip(routeId, "4", true, true, 0);
    }

    @Test
    void consultaDeveAplicarFiltrosDeDataArWifiEAssentosDisponiveis() {
        List<ViagemConsultaDTO> semFiltro = search(DATA, false, false);
        List<ViagemConsultaDTO> comAr = search(DATA, true, false);
        List<ViagemConsultaDTO> comWifi = search(DATA, false, true);
        List<ViagemConsultaDTO> comArEWifi = search(DATA, true, true);

        assertEquals(3, semFiltro.size());
        assertEquals(2, comAr.size());
        assertEquals(2, comWifi.size());
        assertEquals(1, comArEWifi.size());
        assertEquals(LocalTime.of(12, 0), comArEWifi.getFirst().chegada());
        assertEquals(0, search(DATA.plusDays(1), false, false).size());
    }

    @Test
    void cadastroDevePersistirViagemComChegadaERetornaLaNaConsulta() {
        String plate = "T" + suffix.substring(0, 6);
        ViagemCadastroRequestDTO request = new ViagemCadastroRequestDTO(
                driverId, "Cadastro IT " + suffix, "IT Origem " + suffix, null, "IT Destino " + suffix,
                DATA, LocalTime.of(10, 0), LocalTime.of(11, 20), new BigDecimal("24.50"), 8L,
                "VAN", "Van de teste", 2024, "Branca", plate, 12L, true, true, false);

        var created = cadastroService.cadastrar(request);
        List<ViagemConsultaDTO> result = repository.pesquisar(
                "IT Origem " + suffix, "IT Destino " + suffix, Date.valueOf(DATA), true, false);

        assertEquals(1, result.size());
        assertEquals(created.id(), result.getFirst().id());
        assertEquals(LocalTime.of(11, 20), result.getFirst().chegada());
        assertEquals(new BigDecimal("24.50"), result.getFirst().tarifa());
    }

    @Test
    void cadastroDeveRejeitarVagasAcimaDaCapacidade() {
        ViagemCadastroRequestDTO request = new ViagemCadastroRequestDTO(
                driverId, "Rota Inválida", "Origem", null, "Destino", DATA,
                LocalTime.of(10, 0), LocalTime.of(11, 0), new BigDecimal("10.00"), 13L,
                "VAN", "Van teste", 2024, "Branca", "V" + suffix.substring(0, 6), 12L, true, true, false);

        assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> cadastroService.cadastrar(request));
    }

    private List<ViagemConsultaDTO> search(LocalDate date, boolean ac, boolean wifi) {
        return repository.pesquisar("IT Fortaleza " + suffix, "IT Pacajus " + suffix,
                Date.valueOf(date), ac, wifi);
    }

    private void addVehicleAndTrip(Long routeId, String index, boolean ac, boolean wifi, int seats) {
        String vehicleSuffix = suffix + index;
        Long vehicleId = jdbc.queryForObject("""
                INSERT INTO veiculo (tipo, modelo, ano, cor, placa, capacidade_total_passageiros,
                                     aceita_bagagem, ar_condicionado, wifi)
                VALUES ('VAN', 'Integration Test', 2024, 'Branca', ?, 12, TRUE, ?, ?) RETURNING id
                """, Long.class, "I" + suffix.substring(0, 5) + index, ac, wifi);
        LocalTime departure = LocalTime.of(8 + Integer.parseInt(index), 0);
        LocalTime arrival = departure.plusHours(1);
        jdbc.update("""
                INSERT INTO viagem (data_viagem, horario_partida, horario_chegada, vagas_restantes,
                                    id_rota, id_veiculo, id_motorista)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, DATA, departure, arrival, seats, routeId, vehicleId, driverId);
    }
}
