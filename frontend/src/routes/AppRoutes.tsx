import { createBrowserRouter } from "react-router-dom";

// Layouts
import DriverLayout from "../layouts/DriverLayout";

// Páginas Admin
import Drivers from "../pages/management/Drivers";
import TripSearch from "../pages/passenger/TripSearch";

export const router = createBrowserRouter([
  {
    path: "/buscar-viagens",
    element: <TripSearch />,
  },
  {
    // COOPERATIVA
    path: "/gestao",
    element: <DriverLayout />,
    children: [
      // {
      //   index: true, // Corresponde exatamente a /gestao
      //   element: <Overview />,
      // },
      {
        path: "motoristas", // Corresponde a /gestao/motoristas
        element: <Drivers />,
      },
    ],
  },
]);
