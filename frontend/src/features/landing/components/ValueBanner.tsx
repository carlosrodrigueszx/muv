import { LuRoute, LuFileCheck2, LuMessageSquare } from "react-icons/lu";

const pillars = [
  {
    icon: LuRoute,
    title: "Roteiro sob seu controle",
    description:
      "O passageiro define o caminho e o grupo. O motorista conhece os detalhes para avaliar o serviço.",
  },
  {
    icon: LuFileCheck2,
    title: "Informações para escolher",
    description:
      "Fotos, capacidade e condições do veículo ajudam você a comparar as opções antes de enviar uma proposta.",
  },
  {
    icon: LuMessageSquare,
    title: "Conversa sem atalhos",
    description:
      "Revise a oferta antes de confirmar. Depois, alinhe os detalhes diretamente com quem vai conduzir.",
  },
];

export function ValueBanner() {
  return (
    <section className="py-16 bg-[#EBF2EF] border-y border-[#DCE7E2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#2D6A5A] mb-2">
          MENOS IMPROVISO, MAIS CLAREZA
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10">
          Tudo começa com um bom combinado.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-white text-[#1A5344] flex items-center justify-center shadow-2xs">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
