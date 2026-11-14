import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import FreightHistory from "../pages/FreightHistory";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meus-fretes" element={<FreightHistory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
