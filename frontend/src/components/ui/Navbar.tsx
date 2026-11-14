import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMenu, LuX, LuCompass } from "react-icons/lu";

export interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  links?: NavLink[];
  showAuthButtons?: boolean;
}

export function Navbar({ links = [], showAuthButtons = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo MUV */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-[#1A5344] text-white flex items-center justify-center shadow-xs">
            <LuCompass size={18} strokeWidth={2.2} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            MUV
          </span>
        </Link>

        {/* Links Centrais */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#1A5344] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Botões Direita */}
        {showAuthButtons && (
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/entrar"
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1A5344] transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/entrar"
              className="bg-[#1A5344] hover:bg-[#144236] text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
            >
              Criar conta
            </Link>
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 p-1"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700"
            >
              {link.label}
            </a>
          ))}
          {showAuthButtons && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/entrar"
                className="text-center text-sm font-semibold text-slate-800 py-2"
              >
                Entrar
              </Link>
              <Link
                to="/entrar"
                className="text-center text-sm font-semibold bg-[#1A5344] text-white py-2.5 rounded-lg"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
