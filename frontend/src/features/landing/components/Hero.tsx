import { LuArrowRight, LuMapPin } from "react-icons/lu";

export function Hero() {
  return (
    <section className="pt-24 pb-10 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200/70 bg-[#EBF2EF] grid grid-cols-1 lg:grid-cols-12 shadow-xs">
          {/* Bloco Esquerdo (Fundo Verde-Sálvia Claro) */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#2D6A5A] mb-4">
                BONS CAMINHOS COMEÇAM JUNTTO
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-5">
                Quem quer viajar.
                <br />
                Quem leva você.
                <br />
                Um só lugar.
              </h1>
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-8 max-w-md">
                Encontre veículos com motorista para o seu roteiro ou apresente
                seus serviços a novos clientes. A juntto aproxima os dois lados
                da viagem.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 bg-[#1A5344] hover:bg-[#144236] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  Quero viajar <LuArrowRight size={15} />
                </a>
                <a
                  href="#motoristas"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  Sou motorista <LuArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <LuMapPin size={14} className="text-[#1A5344] flex-shrink-0" />
              <span>Fretamento com motorista. Seu grupo, seu roteiro.</span>
            </div>
          </div>

          {/* Bloco Direito (Foto Paisagem + Card Flutuante) */}
          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
              alt="Família admirando vista da praia e estrada"
              className="w-full h-full object-cover"
            />
            {/* Card branco no canto inferior esquerdo da imagem */}
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-xs rounded-xl p-3.5 pr-6 shadow-md border border-slate-100 flex items-center gap-3 max-w-xs">
              <div className="w-8 h-8 rounded-full bg-[#EBF2EF] text-[#1A5344] flex items-center justify-center flex-shrink-0">
                <LuMapPin size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Mais tempo para estar junto.
                </p>
                <p className="text-[11px] text-slate-500">
                  Do primeiro plano à próxima paisagem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
