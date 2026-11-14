import { Link } from "react-router-dom";
import { LuArrowRight, LuCompass, LuGlobe } from "react-icons/lu";

export function Footer() {
  return (
    <footer className="bg-white pt-10 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner CTA Verde Escuro */}
        <div className="bg-[#144538] rounded-2xl p-8 sm:p-10 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-emerald-200/80 mb-1.5">
              O PRÓXIMO CAMINHO COMEÇA AQUI
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">
              Vamos nessa?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Escolha como você quer fazer parte da próxima viagem.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2.5">
            <div className="flex flex-wrap gap-3">
              <Link
                to="/entrar"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                Quero viajar <LuArrowRight size={14} />
              </Link>
              <Link
                to="/entrar"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                Sou motorista <LuArrowRight size={14} />
              </Link>
            </div>
            <p className="text-[11px] text-emerald-200/80 self-start">
              Já tem uma conta?{" "}
              <Link to="/entrar" className="underline hover:text-white">
                Entre para continuar.
              </Link>
            </p>
          </div>
        </div>

        {/* Colunas de Links do Rodapé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#1A5344] text-white flex items-center justify-center">
                <LuCompass size={16} />
              </span>
              <span className="text-base font-extrabold text-slate-900">
                MUV
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Conectando quem quer viajar a quem faz o caminho acontecer.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 mb-3">
              Comece por aqui
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <a href="#motoristas" className="hover:text-slate-800">
                  Para motoristas
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-slate-800">
                  Como funciona
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 mb-3">
              Informações
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <a href="#duvidas" className="hover:text-slate-800">
                  Dúvidas frequentes
                </a>
              </li>
              <li>
                <a href="#termos" className="hover:text-slate-800">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="#privacidade" className="hover:text-slate-800">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Sua conta</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/entrar" className="hover:text-slate-800">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/entrar" className="hover:text-slate-800">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 juntto. Todos os direitos reservados.</p>
          <span className="inline-flex items-center gap-1.5">
            <LuGlobe size={13} /> Português (Brasil)
          </span>
        </div>
      </div>
    </footer>
  );
}
