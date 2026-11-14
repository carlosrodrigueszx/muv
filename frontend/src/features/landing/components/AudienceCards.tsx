import { LuArrowRight, LuUsers, LuCarFront } from "react-icons/lu";

export function AudienceCards() {
  return (
    <section className="py-10 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">
          Um encontro que faz sentido para todo mundo.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Para Passageiros */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
              <LuUsers size={19} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                PARA PASSAGEIROS
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                O veículo certo para o seu grupo
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Encontre opções de fretamento com praticidade. Você escolhe de
                onde sair, aonde ir e quem vai conduzir.
              </p>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A5344] hover:underline"
              >
                Veja como planejar sua viagem <LuArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Card Para Motoristas */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
              <LuCarFront size={19} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                PARA MOTORISTAS
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                Seu serviço no caminho de novos clientes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Dê visibilidade ao seu perfil e veículo. Receba propostas de
                quem procura um motorista para viajar.
              </p>
              <a
                href="#motoristas"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A5344] hover:underline"
              >
                Conheça o espaço do motorista <LuArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
