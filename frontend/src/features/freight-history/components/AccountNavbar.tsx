import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuBell,
  LuChevronDown,
  LuCompass,
  LuMenu,
  LuX,
} from "react-icons/lu";

const accountLinks = [
  { label: "Solicitar frete", to: "/solicitar-frete" },
  { label: "Prestadores", to: "/prestadores" },
  { label: "Meus fretes", to: "/meus-fretes" },
];

export function AccountNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Página inicial MUV">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#176A5B] text-white">
            <LuCompass size={18} strokeWidth={2.2} />
          </span>
          <span className="text-[27px] font-extrabold tracking-tight text-[#124D43]">MUV</span>
        </Link>

        <nav className="hidden h-full items-center gap-9 text-sm font-medium text-slate-600 md:flex">
          {accountLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex h-full items-center border-b-2 px-1 transition-colors hover:text-[#176A5B] ${
                link.to === "/meus-fretes"
                  ? "border-[#176A5B] font-semibold text-[#176A5B]"
                  : "border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <button className="text-xs font-medium text-slate-600 hover:text-[#176A5B]" type="button">
            Trocar perfil
          </button>
          <span className="h-6 w-px bg-slate-200" />
          <button type="button" aria-label="Notificações" className="text-slate-500 hover:text-[#176A5B]">
            <LuBell size={19} />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5F2EF] text-xs font-bold text-[#176A5B]">
            AO
          </span>
          <button type="button" aria-label="Abrir opções da conta" className="text-slate-500">
            <LuChevronDown size={18} />
          </button>
        </div>

        <button
          type="button"
          className="p-2 text-slate-700 md:hidden"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <LuX size={23} /> : <LuMenu size={23} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="space-y-1 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          {accountLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <button type="button" className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#176A5B]">
            Trocar perfil
          </button>
        </nav>
      )}
    </header>
  );
}
