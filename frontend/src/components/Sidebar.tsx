import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  path: string;
}

export default function Sidebar() {
  const menuItems: MenuItem[] = [
    { name: "Painel Geral", path: "/" },
    { name: "Frota de Veículos", path: "veiculos" },
    { name: "Avaliações", path: "avaliacoes" },
    { name: "Motoristas", path: "motoristas" },
    { name: "Achados e Perdidos", path: "achados-perdidos" },
    { name: "Relatório de Demanda", path: "relatorio" },
  ];

  return (
    <aside className="bg-white w-2xs">
      <nav className="px-[16px] space-y-2 font-semibold">
        {menuItems.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }): string =>
              `flex items-center px-4 py-2.5 rounded-lg transition-colors font-semibold
                ${
                  isActive
                    ? "bg-primary text-white" // Estilo Ativo
                    : "" // Estilo Normal
                }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
