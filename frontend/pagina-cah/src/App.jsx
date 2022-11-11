import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ArbitrosCRUD from "/src/cruds/ArbitrosCRUD.jsx";
import AsociacionesCRUD from "/src/cruds/AsociacionesCRUD.jsx";
import ClubesCRUD from "/src/cruds/ClubesCRUD.jsx";
import EquiposCRUD from "/src/cruds/EquiposCRUD.jsx";
import JugadoresCRUD from "/src/cruds/JugadoresCRUD.jsx";
import MesasCRUD from "/src/cruds/MesasCRUD.jsx";
import PartidosCRUD from "/src/cruds/PartidosCRUD.jsx";
import PasesCRUD from "/src/cruds/PasesCRUD.jsx";
import SedesCRUD from "/src/cruds/SedesCRUD.jsx";
import TorneosCRUD from "/src/cruds/TorneosCRUD.jsx";
import UsuariosCRUD from "/src/cruds/UsuariosCRUD.jsx";
import InicioCAH from "/src/paginas/InicioCAH.jsx";
import Login from "/src/paginas/Login.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InicioCAH />} />
          <Route path="/login" element={<Login />} />
          <Route path="/asociaciones" element={<AsociacionesCRUD />} />
          <Route path="/arbitros" element={<ArbitrosCRUD />} />
          <Route path="/clubes" element={<ClubesCRUD />} />
          <Route path="/equipos" element={<EquiposCRUD />} />
          <Route path="/jugadores" element={<JugadoresCRUD />} />
          <Route path="/mesas" element={<MesasCRUD />} />
          <Route path="/partidos" element={<PartidosCRUD />} />
          <Route path="/pases" element={<PasesCRUD />} />
          <Route path="/sedes" element={<SedesCRUD />} />
          <Route path="/torneos" element={<TorneosCRUD />} />
          <Route path="/usuarios" element={<UsuariosCRUD />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
