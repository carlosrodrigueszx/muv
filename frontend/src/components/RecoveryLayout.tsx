import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function RecoveryLayout({
  title,
  description,
  children,
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fe] px-4 py-10 text-slate-800">
      <section className="w-full max-w-[530px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="px-6 py-7 sm:px-10">
          <div className="flex items-center justify-between gap-2 text-xs text-[#0f4c81]">
            <span className="font-semibold">
              MUV Transporte Regional
            </span>
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1">
              Acesso seguro
            </span>
          </div>

          <header className="mb-8 mt-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f4c81] text-white shadow-md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect x="5" y="3" width="14" height="16" rx="3" />
                <path d="M5 11h14M8 15h2m4 0h2M8 19v2m8-2v2" />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </header>

          {children}
        </div>

        <footer className="border-t border-slate-100 bg-[#f1f5f9] px-5 py-4 text-center text-xs text-slate-500">
          MUV — Plataforma de Transporte Regional de Passageiros
        </footer>
      </section>
    </main>
  );
}
