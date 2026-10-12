import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

type Usuario = {
  nome?: string;
  email: string;
};

type Csrf = {
  headerName: string;
  token: string;
};

async function obterCsrf(): Promise<Csrf> {
  const resposta = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível iniciar a sessão segura.");
  }

  return resposta.json();
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    let ativo = true;

    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(async (resposta) => {
        if (ativo && resposta.ok) {
          setUsuario(await resposta.json());
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível verificar a sessão.");
      })
      .finally(() => {
        if (ativo) setVerificando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const csrf = await obterCsrf();

      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ email, senha }),
      });

      if (resposta.status === 401) {
        throw new Error("E-mail ou senha inválidos.");
      }

      if (!resposta.ok) {
        throw new Error("Não foi possível entrar na conta.");
      }

      const dados: Usuario = await resposta.json();
      setUsuario(dados);
      setSenha("");
    } catch (falha) {
      setErro(
        falha instanceof Error ? falha.message : "Erro inesperado."
      );
    } finally {
      setEnviando(false);
    }
  }

  async function sair() {
    setErro("");
    setEnviando(true);

    try {
      const csrf = await obterCsrf();

      const resposta = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          [csrf.headerName]: csrf.token,
        },
      });

      if (resposta.status !== 204) {
        throw new Error("Não foi possível encerrar a sessão.");
      }

      setUsuario(null);
      setEmail("");
      setSenha("");
    } catch (falha) {
      setErro(
        falha instanceof Error ? falha.message : "Erro inesperado."
      );
    } finally {
      setEnviando(false);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fe] px-4 py-10 text-slate-800">
      <section className="w-full max-w-[530px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="px-6 py-7 sm:px-10">
          <div className="flex items-center justify-between text-xs text-[#0f4c81]">
            <span className="font-semibold">MUV Transporte Regional</span>
            <span className="rounded-full bg-blue-50 px-3 py-1">
              Acesso seguro
            </span>
          </div>

          <div className="mb-8 mt-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f4c81] text-white shadow-md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect x="5" y="3" width="14" height="16" rx="3" />
                <path d="M8 7h8M8 11h8M8 16h2m4 0h2M8 19v2m8-2v2" />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Portal de Acesso MUV
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Sistema unificado para passageiros, motoristas
              permissionários e gestão de cooperativas de transporte.
            </p>
          </div>

          {verificando ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Verificando sessão...
            </p>
          ) : usuario ? (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#0f4c81]">
                Minha conta
              </h2>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Você está autenticado como:
                </p>
                <p className="mt-2 break-all font-semibold">
                  {usuario.email}
                </p>
              </div>

              <button
                type="button"
                onClick={sair}
                disabled={enviando}
                className="w-full rounded-lg bg-[#0f4c81] px-4 py-3 font-semibold text-white hover:bg-[#0b3c66] disabled:opacity-50"
              >
                {enviando ? "Saindo..." : "Sair da conta"}
              </button>
            </div>
          ) : (
            <form onSubmit={entrar} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Identificador de acesso
                </span>

                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Seu e-mail cadastrado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-4 py-3 text-sm outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Chave de acesso criptografada
                </span>

                <div className="flex items-center rounded-lg border border-slate-200 bg-[#f1f5f9] focus-within:border-[#0f4c81] focus-within:ring-2 focus-within:ring-blue-100">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="px-3 text-xs font-medium text-[#0f4c81]"
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              <div className="flex justify-end">
                <Link
                  to="/esqueci-senha"
                  className="text-xs font-semibold text-[#0f4c81] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-lg bg-[#0f4c81] px-4 py-3.5 font-semibold text-white shadow-md hover:bg-[#0b3c66] disabled:opacity-50"
              >
                {enviando ? "Entrando..." : "Entrar no Sistema MUV →"}
              </button>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Outras formas de acesso
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  title="Integração ainda não implementada"
                  className="rounded-lg bg-slate-100 px-2 py-3 text-xs font-semibold text-slate-500"
                >
                  Gov.br (em breve)
                </button>

                <button
                  type="button"
                  disabled
                  title="Integração ainda não implementada"
                  className="rounded-lg bg-slate-100 px-2 py-3 text-xs font-semibold text-slate-500"
                >
                  SMS / WhatsApp (em breve)
                </button>
              </div>

              <div className="flex flex-col gap-3 rounded-xl bg-[#f1f5f9] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold">
                    Ainda não tem cadastro no MUV?
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Crie sua conta para utilizar o transporte regional.
                  </p>
                </div>

                <Link
                  to="/cadastro"
                  className="shrink-0 rounded-lg bg-blue-100 px-4 py-2.5 text-center text-xs font-bold text-[#0f4c81] hover:bg-blue-200"
                >
                  Criar Nova Conta
                </Link>
              </div>
            </form>
          )}

          {erro && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {erro}
            </p>
          )}
        </div>

        <footer className="border-t border-slate-100 bg-[#f1f5f9] px-5 py-4 text-center text-xs text-slate-500">
          MUV — Plataforma de Transporte Regional de Passageiros
        </footer>
      </section>
    </main>
  );
}
