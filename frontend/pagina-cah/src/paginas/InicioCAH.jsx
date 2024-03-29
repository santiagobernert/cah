import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "/src/App.css";
export default function Inicio() {
  let cruds = [
    "arbitros",
    "asociaciones",
    "articulos",
    "clubes",
    "equipos",
    "jugadores",
    "mesas",
    "partidos",
    "pases",
    "sedes",
    "torneos",
    "usuarios",
  ];
  return (
    <div>
      <div className="container">
        <div className="text-center my-5">
          <h1>Confederación Argentina de Handball</h1>
        </div>
      </div>
      <div>
        <div className="container">
          <h4>Tablero de control</h4>
          <div className="d-flex w-100 justify-content-evenly flex-wrap">
            {cruds.map((item) => (
              <a
                className="text-decoration-none text-white bg-primary p-4 m-3 rounded"
                target="blank"
                href={item}
              >
                <div key={cruds.indexOf(item)}>
                  <h5>{item.charAt(0).toUpperCase()}{item.substring(1)}</h5>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
