import ResetPassword from "../pages/passenger/ResetPassword";
import ForgotPassword from "../pages/passenger/ForgotPassword";
import Login from "../pages/passenger/Login";
import Register from "../pages/passenger/Register";
import { createBrowserRouter } from "react-router-dom";

// Layouts
import DriverLayout from "../layouts/DriverLayout";

// Páginas Admin
import Drivers from "../pages/management/Drivers";

export const router = createBrowserRouter([
  { path: "/redefinir-senha", element: <ResetPassword /> },
  { path: "/esqueci-senha", element: <ForgotPassword /> },
  { path: "/login", element: <Login /> },
  { path: "/cadastro", element: <Register /> },
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
