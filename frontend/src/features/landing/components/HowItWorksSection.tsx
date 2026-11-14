import { LuArrowRight, LuPlus, LuRoute } from "react-icons/lu";
import { Link } from "react-router-dom";

const steps = [
  {
    num: 1,
    title: "Defina um roteiro que é seu",
    desc: "Escolha origem, destino, data e horário. Adicione quantas paradas intermediárias precisar, na ordem que preferir.",
  },
  {
    num: 2,
    title: "Encontre o veículo e o motorista",
    desc: "Compare capacidade, comodidades e informações do serviço para escolher o que combina com seu grupo.",
  },
  {
    num: 3,
    title: "Envie sua proposta",
    desc: "Revise o itinerário e o valor antes de enviar a solicitação ao motorista.",
  },
  {
    num: 4,
    title: "Receba a resposta e decida",
    desc: "O motorista pode aceitar ou fazer uma contraproposta. Você pode cancelar, enviar nova proposta ou confirmar.",
  },
  {
    num: 5,
    title: "Confirme e entre em contato",
    desc: "Com a oferta confirmada, fale diretamente com o motorista para combinar os detalhes da viagem.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna Esquerda: 5 Passos */}
          <div className="lg:col-span-7">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#2D6A5A] mb-2">
              A QUEM QUER VIAJAR
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-8">
              Você faz os planos.
              <br />A MUV aproxima os caminhos.
            </h2>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-[#EBF2EF] text-[#1A5344] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Direita: Card Interativo de Roteiro + Botão abaixo */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Seu grupo. Seu roteiro.
                </h3>
                <LuRoute size={16} className="text-[#1A5344]" />
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[11px] font-semibold bg-[#EBF2EF] text-[#1A5344] px-2.5 py-1 rounded-md">
                  Ida e volta
                </span>
                <span className="text-[11px] font-semibold bg-[#EBF2EF] text-[#1A5344] px-2.5 py-1 rounded-md">
                  6 passageiros
                </span>
              </div>

              {/* Lista de Paradas */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#1A5344] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    A
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      ORIGEM
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      São Paulo · Av. Paulista
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#EBF2EF] text-[#1A5344] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      PARADA
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      São Bernardo do Campo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#EBF2EF] text-[#1A5344] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      PARADA
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      Cubatão · Centro
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#1A5344] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    B
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      DESTINO
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      Santos · Aquário
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A5344]">
                  <LuPlus size={14} /> Quantas paradas precisar, na sua ordem.
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Exemplo de roteiro personalizado. Não é carona nem uma rota
                  fixa definida pelo motorista.
                </p>
              </div>
            </div>

            <Link
              to="/entrar"
              className="mt-4 inline-flex items-center gap-2 bg-[#1A5344] hover:bg-[#144236] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              Começar meu roteiro <LuArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
