import RecoveryLayout from "../../components/RecoveryLayout";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function solicitar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setErro("");

    try {
      const respostaCsrf = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
      });

      if (!respostaCsrf.ok) {
        throw new Error("Não foi possível iniciar uma sessão segura.");
      }

      const csrf: { token: string; headerName: string } =
        await respostaCsrf.json();

      const resposta = await fetch("/api/auth/recuperacao/solicitar", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ email }),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível processar a solicitação.");
      }

      setSucesso(true);
    } catch (falha) {
      setErro(
        falha instanceof Error ? falha.message : "Erro inesperado."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <RecoveryLayout
      title="Recuperar senha"
      description="Informe o e-mail cadastrado para solicitar um link de recuperação de acesso."
    >
      {sucesso ? (
        <div
          role="status"
          className="rounded-xl border border-green-100 bg-green-50 p-5 text-sm leading-relaxed text-green-800"
        >
          <p className="font-semibold">
            Solicitação recebida!
          </p>
          <p className="mt-2">
            Se existir uma conta com esse e-mail, você receberá
            as instruções para redefinir sua senha.
          </p>
        </div>
      ) : (
        <form onSubmit={solicitar} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              E-mail de recuperação
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail cadastrado"
              className="w-full rounded-xl border border-slate-200 bg-[#f1f5f9] px-4 py-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-[#0f4c81] focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-[#0f4c81]">
            Por segurança, enviaremos as instruções apenas
            para o e-mail associado à sua conta.
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-[#0f4c81] px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#0b3c66] disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar link de recuperação →"}
          </button>
        </form>
      )}

      {erro && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </p>
      )}

      <Link
        to="/login"
        className="mt-6 block text-center text-sm font-semibold text-[#0f4c81] hover:underline"
      >
        ← Voltar ao login
      </Link>
    </RecoveryLayout>
  );
}
