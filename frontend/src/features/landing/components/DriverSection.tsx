import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuCarFront,
  LuMapPinned,
  LuHandshake,
} from "react-icons/lu";

export function DriverSection() {
  return (
    <section
      id="motoristas"
      className="py-20 bg-white border-t border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Esquerda: Foto do Motorista + Card Flutuante */}
          <div className="lg:col-span-6 relative pb-8">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000"
                alt="Motorista profissional ao lado do veículo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card branco sobreposto na base */}
            <div className="relative -mt-10 mx-4 sm:mx-6 bg-white rounded-xl p-4 shadow-md border border-slate-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
                <LuCarFront size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Um perfil completo abre caminhos.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mostre seu veículo, suas comodidades e o que seu serviço tem a
                  oferecer.
                </p>
              </div>
            </div>
          </div>

          {/* Direita: Conteúdo */}
          <div className="lg:col-span-6">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#2D6A5A] mb-2">
              PARA QUEM FAZ A VIAGEM ACONTECER
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
              Seu serviço merece
              <br />
              ser encontrado.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              Aproxime seu trabalho de pessoas que precisam de um veículo com
              motorista. Você apresenta seu serviço e avalia cada oportunidade.
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <LuCarFront size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Apresente seu perfil e veículo
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">
                    Divulgue fotos, capacidade, comodidades e condições dos seus
                    serviços para novos clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <LuMapPinned size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Conheça o roteiro antes de responder
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">
                    Revise origem, destino, paradas, horários e necessidades do
                    grupo em cada solicitação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <LuHandshake size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Aceite ou faça uma contraproposta
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">
                    Avalie o serviço e proponha um novo valor quando necessário,
                    com uma justificativa clara.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/entrar"
              className="inline-flex items-center gap-2 bg-[#1A5344] hover:bg-[#144236] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              Quero divulgar meu serviço <LuArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
