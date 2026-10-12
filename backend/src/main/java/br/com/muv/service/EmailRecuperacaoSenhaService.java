package br.com.muv.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmailRecuperacaoSenhaService {

    private final ObjectProvider<JavaMailSender> transportes;
    private final String remetente;
    private final String frontendUrl;

    public EmailRecuperacaoSenhaService(
            ObjectProvider<JavaMailSender> transportes,
            @Value("${MUV_MAIL_FROM:}") String remetente,
            @Value("${MUV_FRONTEND_URL:}") String frontendUrl
    ) {
        this.transportes = transportes;
        this.remetente = remetente;
        this.frontendUrl = frontendUrl;
    }

    public void verificarDisponibilidade() {
        if (transportes.getIfAvailable() == null
                || remetente.isBlank()
                || frontendUrl.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Servico de recuperacao indisponivel"
            );
        }
    }

    public void enviarLink(String destinatario, String token) {
        verificarDisponibilidade();

        String link = frontendUrl.replaceAll("/+$", "")
                + "/redefinir-senha?token="
                + URLEncoder.encode(
                        token, StandardCharsets.UTF_8
                );

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("MUV - Recuperacao de senha");
        mensagem.setText(
                "Foi solicitada a recuperacao de senha da sua conta MUV.\n\n"
                + "Acesse o link para definir uma nova senha:\n"
                + link + "\n\n"
                + "O link expira em 30 minutos e pode ser utilizado uma vez.\n\n"
                + "Se voce nao solicitou, ignore esta mensagem."
        );

        transportes.getObject().send(mensagem);
    }
}
