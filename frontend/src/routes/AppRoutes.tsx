import { createBrowserRouter } from "react-router-dom";

// Layouts
import DriverLayout from "../layouts/DriverLayout";

// Páginas Admin
import Drivers from "../pages/management/Drivers";

export const router = createBrowserRouter([
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
