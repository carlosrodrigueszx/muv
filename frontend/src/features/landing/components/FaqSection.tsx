import { useState } from "react";
import { LuChevronDown, LuInfo } from "react-icons/lu";

const faqs = [
  {
    q: "A juntto é para passageiros ou motoristas?",
    a: "Para os dois. Passageiros encontram veículos com motorista para fretar. Motoristas divulgam seu perfil, veículo e serviços para alcançar novos clientes.",
  },
  {
    q: "Eu escolho o trajeto ou sigo uma rota pronta?",
    a: "No fretamento personalizado, você define origem, destino e quantas paradas intermediárias precisar, na ordem desejada. Não é um serviço de carona com rota fixa do motorista.",
  },
  {
    q: "Como funcionam as propostas?",
    a: "Você envia seu roteiro e uma proposta ao motorista. Ele pode aceitar ou enviar uma contraproposta. Após a resposta, você pode cancelar, enviar nova proposta ou confirmar a oferta e entrar em contato.",
  },
  {
    q: "O pagamento é feito pelo aplicativo?",
    a: "Não. A juntto não realiza pagamentos no app. Confirmar a oferta é aceitar a proposta; o acerto final e os detalhes da viagem são combinados diretamente com o motorista.",
  },
  {
    q: "Sou motorista. Como começo?",
    a: "Crie sua conta de motorista e apresente seu perfil, veículo e serviços. Mantenha as informações claras para ser encontrado e avalie os itinerários recebidos antes de aceitar ou fazer uma contraproposta.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="duvidas"
      className="py-20 bg-[#FAFAFA] border-t border-slate-200/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-4">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#2D6A5A] mb-2">
              ANTES DE COMEÇAR
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
              Um caminho claro,
              <br />
              desde o início.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              As principais respostas para quem vai viajar e para quem vai
              conduzir.
            </p>

            <div className="bg-[#EBF2EF] border border-[#DCE7E2] rounded-xl p-4 flex items-start gap-3">
              <LuInfo
                size={16}
                className="text-[#1A5344] flex-shrink-0 mt-0.5"
              />
              <p className="text-xs text-slate-700 leading-relaxed">
                Sem pagamentos no app. Você confirma a oferta e combina
                diretamente com o motorista.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Lista de Perguntas */}
          <div className="lg:col-span-8 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {item.q}
                    </span>
                    <LuChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed pr-6">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
