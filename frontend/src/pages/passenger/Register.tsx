import { useState } from "react";
import type { FormEvent } from "react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const nome = String(data.get("nome") ?? "").trim();
    const cpf = String(data.get("cpf") ?? "").replace(/\D/g, "");
    const telefone = String(data.get("telefone") ?? "").replace(/\D/g, "");
    const email = String(data.get("email") ?? "").trim();
    const senha = String(data.get("senha") ?? "");
    const confirmarSenha = String(data.get("confirmarSenha") ?? "");

    setSuccess(false);
    setMessage("");

    if (cpf.length !== 11) {
      setMessage("Informe um CPF com 11 dígitos.");
      return;
    }

    if (telefone.length < 10 || telefone.length > 11) {
      setMessage("Informe um telefone válido.");
      return;
    }

    if (senha !== confirmarSenha) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const csrfResponse = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
      });

      if (!csrfResponse.ok) {
        throw new Error("Não foi possível iniciar uma sessão segura.");
      }

      const csrf: { token: string; headerName: string } =
        await csrfResponse.json();

      const response = await fetch("/api/passageiros", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({
          nome,
          cpf,
          telefone,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("CPF ou e-mail já cadastrado.");
        }
        if (response.status === 400) {
          throw new Error("Verifique os dados informados.");
        }
        throw new Error("Não foi possível realizar o cadastro.");
      }

      setSuccess(true);
      setMessage("Passageiro cadastrado com sucesso!");
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao conectar com a API."
      );
    } finally {
      setLoading(false);
    }
  }


  const inputStyle =
    "mt-2 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f4c81] focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-[#f7f9fe] px-4 py-8 text-slate-800 sm:py-12">
      <div className="mx-auto max-w-6xl rounded-[24px] border border-slate-200 bg-white px-5 py-8 shadow-xl shadow-slate-900/5 sm:px-10 sm:py-10">
        <a
          href="/login"
          className="text-sm font-medium text-[#0f4c81] hover:underline"
        >
          ← Já tem conta? Fazer login
        </a>

        <h1 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-[#103e5a] sm:text-3xl lg:text-4xl">
          Crie sua Conta no MUV
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Selecione seu perfil para iniciar seu cadastro.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-[#0f4c81] bg-white p-4 shadow-md shadow-slate-900/5 sm:p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0f4c81]">
                <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
              </span>
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                CPF
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold">Passageiro</h2>
            <p className="text-xs text-slate-500">Usuário comum</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Para consultar viagens, reservar assentos e
              acompanhar o transporte regional.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#0f4c81]">
              Perfil selecionado
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-90 sm:p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <rect x="5" y="3" width="14" height="16" rx="3" />
      <path d="M5 11h14M8 15h2m4 0h2M8 19v2m8-2v2" />
    </svg>
              </span>
              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold">
                CNH
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold">
              Motorista Individual
            </h2>
            <p className="text-xs text-slate-500">
              Permissionário autônomo
            </p>
            <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
              Cadastro operacional de motoristas e veículos
              autorizado pela plataforma.
            </p>
            <p className="mt-3 text-xs font-semibold">Em breve</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-90 sm:p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" />
    </svg>
              </span>
              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold">
                CNPJ
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold text-[#103e5a]">
              Cooperativa ou Empresa
            </h2>
            <p className="text-xs text-slate-500">
              Gestão de linhas e frota
            </p>
            <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
              Para cooperativas e empresas responsáveis pela
              gestão do transporte de passageiros.
            </p>
            <p className="mt-3 text-xs font-semibold">Em breve</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          <section aria-labelledby="dados-pessoais">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="rounded-lg bg-blue-100 px-3 py-2 font-bold text-[#0f4c81]">
                01
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Etapa 1 de 2
                </p>
                <h2
                  id="dados-pessoais"
                  className="text-lg font-bold text-[#103e5a]"
                >
                  Dados Pessoais do Passageiro
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Nome completo</span>
                <input
                  className={inputStyle}
                  name="nome"
                  autoComplete="name"
                  maxLength={150}
                  placeholder="Seu nome completo"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">CPF do titular</span>
                <input
                  className={inputStyle}
                  name="cpf"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="Somente números"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">
                  Celular / WhatsApp principal
                </span>
                <input
                  className={inputStyle}
                  name="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(85) 99999-9999"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">E-mail principal</span>
                <input
                  className={inputStyle}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </label>
            </div>
          </section>

          <section aria-labelledby="credenciais">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="rounded-lg bg-blue-100 px-3 py-2 font-bold text-[#0f4c81]">
                02
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Etapa 2 de 2
                </p>
                <h2
                  id="credenciais"
                  className="text-lg font-bold text-[#103e5a]"
                >
                  Credenciais de Acesso
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Senha de acesso</span>
                <input
                  className={inputStyle}
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Confirmar senha</span>
                <input
                  className={inputStyle}
                  name="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Utilize pelo menos 8 caracteres para sua senha.
            </p>

            <div className="mt-6 rounded-lg bg-[#f1f5f9] p-4 text-sm text-slate-600">
              Os dados informados serão utilizados para criar
              sua conta de passageiro no MUV.
            </div>
          </section>

          {message && (
            <p
              role="alert"
              className={
                success
                  ? "rounded-lg bg-green-50 p-4 text-sm text-green-700"
                  : "rounded-lg bg-red-50 p-4 text-sm text-red-700"
              }
            >
              {message}
            </p>
          )}

          <div className="mx-auto max-w-2xl">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f4c81] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#0b3c66] disabled:opacity-50"
            >
              {loading
                ? "Cadastrando..."
                : "Concluir Cadastro"}
            </button>

            {success && (
              <a
                href="/login"
                className="mt-4 block text-center font-semibold text-[#0f4c81] underline"
              >
                Entrar na minha conta →
              </a>
            )}

            <p className="mt-4 text-center text-xs text-slate-500">
              MUV — Transporte Regional de Passageiros
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
