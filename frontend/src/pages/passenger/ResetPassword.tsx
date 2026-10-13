import RecoveryLayout from "../../components/RecoveryLayout";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [parametros] = useSearchParams();
  const token = parametros.get("token") ?? "";

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function redefinir(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (new TextEncoder().encode(senha).length > 72) {
      setErro("A senha deve ter no máximo 72 bytes.");
      return;
    }

    setEnviando(true);

    try {
      const respostaCsrf = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
      });

      if (!respostaCsrf.ok) {
        throw new Error("Não foi possível iniciar a sessão segura.");
      }

      const csrf: { token: string; headerName: string } =
        await respostaCsrf.json();

      const resposta = await fetch("/api/auth/recuperacao/redefinir", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({
          token,
          novaSenha: senha,
        }),
      });

      if (!resposta.ok) {
        throw new Error(
          "Link inválido, expirado ou já utilizado."
        );
      }

      setSucesso(true);
      setSenha("");
      setConfirmacao("");
      window.history.replaceState(
        window.history.state,
        "",
        "/redefinir-senha"
      );
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
      title="Redefinir senha"
      description="Crie uma nova senha para recuperar o acesso à sua conta no MUV."
    >
      {sucesso ? (
        <div
          role="status"
          className="rounded-xl border border-green-100 bg-green-50 p-5 text-sm leading-relaxed text-green-800"
        >
          <p className="font-semibold">
            Senha atualizada com sucesso!
          </p>
          <p className="mt-2">
            Você já pode entrar na sua conta utilizando
            a nova senha.
          </p>
        </div>
      ) : !token ? (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700"
        >
          Link de recuperação ausente.
          Solicite um novo link para redefinir sua senha.
        </div>
      ) : (
        <form onSubmit={redefinir} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Nova senha
            </span>
            <input
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua nova senha"
              className="w-full rounded-xl border border-slate-200 bg-[#f1f5f9] px-4 py-3.5 text-base outline-none transition focus:border-[#0f4c81] focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Confirmar nova senha
            </span>
            <input
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Confirme sua nova senha"
              className="w-full rounded-xl border border-slate-200 bg-[#f1f5f9] px-4 py-3.5 text-base outline-none transition focus:border-[#0f4c81] focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-[#0f4c81]">
            Use no mínimo 8 caracteres. A nova senha
            substituirá sua senha anterior.
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-[#0f4c81] px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#0b3c66] disabled:opacity-50"
          >
            {enviando ? "Salvando..." : "Redefinir senha →"}
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
