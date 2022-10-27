import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Form,
} from "react-bootstrap";

function PasesCRUD() {
  const [data, setdata] = useState({ pases: [] });
  const [clubes, setClubes] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    pase: data.pases.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    jugador: "",
    fecha: "",
    club_salida: "",
    club_llegada: "",
    tipo: "",
  });
  const ref = useRef({
    id: useRef(0),
    jugador: useRef(""),
    fecha: useRef(""),
    club_salida: useRef(""),
    club_llegada: useRef(""),
    tipo: useRef(""),
  });
  useEffect(() => {
    getClubes();
    getJugadores();
    fetch("http://localhost:5000/pases")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  }, []);

  const getClubes = () => {
    fetch("http://localhost:5000/club")
      .then((res) => res.json())
      .then((responseJson) => {
        setClubes(responseJson.clubes);
        return responseJson;
      });
  };

  const getJugadores = () => {
    fetch("http://localhost:5000/jugador")
      .then((res) => res.json())
      .then((responseJson) => {
        setJugadores(responseJson.jugadores);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/pases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .catch((error) => console.log("post", error));
  };

  const putData = () => {
    fetch("http://localhost:5000/pases", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const deleteData = (id) => {
    fetch("http://localhost:5000/pases", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(id),
    })
      .then((response) => response.json())
      .catch((error) => console.log("delete", error));
  };

  const mostrarModalActualizar = (pase) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, pase: pase });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      pase: modalActualizar.pase,
    });
  };

  const mostrarModalInsertar = () => {
    console.log("mostrar insertar");
    setmodalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    console.log("cerrar insertar");
    setmodalInsertar(false);
  };

  const editar = (dato) => {
    console.log("editar");
    let contador = 0;
    let datos = data.pases;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].jugador = dato.jugador;
        datos[contador].fecha = dato.fecha;
        datos[contador].club_salida = dato.club_salida;
        datos[contador].club_llegada = dato.club_llegada;
        datos[contador].tipo = dato.tipo;
      }
      contador++;
    });
    setdata({ pases: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      pase: modalActualizar.pase,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data.pases;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ pases: arreglo });
      setmodalActualizar({
        abierto: false,
        pase: modalActualizar.pase,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.pases.length + 1;
    let lista = data.pases;
    lista.push(valorNuevo);
    setdata({ pases: lista });
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      jugador: ref.current["jugador"].current.value,
      fecha: ref.current["fecha"].current.value,
      club_salida: ref.current["club_salida"].current.value,
      club_llegada: ref.current["club_llegada"].current.value,
      tipo: ref.current["tipo"].current.value,
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
      club_salida: ref.current["club_salida"].current.value
        ? clubes.find(
            (c) => c.nombre === ref.current["club_salida"].current.value
          ).id
        : "",
      tipo: ref.current["tipo"].current.value,
    });
    console.log(form);
  };

  const tipoDePase = (club_salida, club_llegada) => {
    if (club_salida.asociacion != club_llegada.asociacion) {
      console.log("Nacional");
      return "Nacional";
    } else {
      console.log("Provincial");
      return "Provincial";
    }
  };

  return (
    <>
      <Container>
        <h2>Pases</h2>
        <br />
        <Button color="success" onClick={() => mostrarModalInsertar()}>
          Crear
        </Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Dni</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha</th>
              <th>Club Salida</th>
              <th>Club Llegada</th>
              <th>Tipo</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.pases.map((pase) => (
              <tr key={pase.id}>
                <td>{pase.id}</td>
                <td>
                  {pase.jugador
                    ? jugadores.find((j) => j.id === pase.jugador)
                      ? jugadores.find((j) => j.id === pase.jugador).dni
                      : ""
                    : ""}
                </td>
                <td>
                  {pase.jugador
                    ? jugadores.find((j) => j.id === pase.jugador).nombre
                    : ""}
                </td>
                <td>
                  {pase.jugador
                    ? jugadores.find((j) => j.id === pase.jugador).apellido
                    : ""}
                </td>
                <td>{pase.fecha}</td>
                <td>
                  {pase.club_salida
                    ? clubes.find((c) => c.id == pase.club_salida).nombre
                    : ""}
                </td>
                <td>
                  {pase.club_llegada
                    ? clubes.find((c) => c.id == pase.club_llegada).nombre
                    : ""}
                </td>
                <td>{pase.tipo}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(pase)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(pase)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={modalActualizar.abierto}>
        <ModalHeader>
          <div>
            <h3>Editar Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              ref={ref.current.id}
              defaultValue={modalActualizar.pase.id}
            />
          </FormGroup>

          <FormGroup>
            <label>Jugador</label>
            <input
              onChange={handleChangeEdit}
              list="jugadores_list"
              type="search"
              className="form-control ds-input"
              name="jugador"
              ref={ref.current.jugador}
              defaultValue={modalActualizar.pase.jugador}
              placeholder="Buscar jugador..."
              aria-label="Search docs for..."
              autoComplete="off"
              data-bd-docs-version="5.1"
              spellCheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
            ></input>
            <datalist id="jugadores_list">
              <option>Jugador</option>
              {jugadores.map((jugador) => {
                return (
                  <option
                    key={jugador.id}
                    value={jugador.id}
                    className="dropdown-item"
                  >
                    {jugador.dni}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              ref={ref.current.fecha}
              defaultValue={modalActualizar.pase.fecha}
              type="date"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Club Salida</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club_salida"
              ref={ref.current.club_salida}
              defaultValue={modalActualizar.pase.club_salida}
              placeholder="Buscar club..."
              aria-label="Search docs for..."
              autoComplete="off"
              data-bd-docs-version="5.1"
              spellCheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
            ></input>
            <datalist id="clubes_list">
              <option>Todos</option>
              {clubes.map((club) => {
                return (
                  <option
                    key={club.id}
                    value={club.id}
                    className="dropdown-item"
                  >
                    {club.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Club Llegada</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club_llegada"
              ref={ref.current.club_llegada}
              defaultValue={modalActualizar.pase.club_llegada}
              placeholder="Buscar club..."
              aria-label="Search docs for..."
              autoComplete="off"
              data-bd-docs-version="5.1"
              spellCheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
            ></input>
            <datalist id="clubes_list">
              <option>Todos</option>
              {clubes.map((club) => {
                if (form.club_salida) {
                  if (club.id != form.club_salida) {
                    return (
                      <option
                        key={club.id}
                        value={club.id}
                        className="dropdown-item"
                      >
                        {club.nombre}
                      </option>
                    );
                  }
                }
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Tipo:</label>
            <Form.Control
              name="categoria"
              plaintext
              readOnly
              ref={ref.current.tipo}
              id="tipo"
              defaultValue={
                form.club_llegada && form.club_salida
                  ? tipoDePase(
                      clubes.find((c) => c.id == form.club_salida),
                      clubes.find((c) => c.id == form.club_llegada)
                    )
                  : ""
              }
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => editar(form)}>
            Editar
          </Button>
          <Button color="danger" onClick={() => cerrarModalActualizar()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Nuevo Pase</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.pases.length + 1}
            />
          </FormGroup>

          <FormGroup>
            <label>Jugador</label>
            <input
              onChange={handleChangeInsert}
              list="jugadores_list"
              type="search"
              className="form-control ds-input"
              name="jugador"
              ref={ref.current.jugador}
              defaultValue={modalActualizar.pase.jugador}
              placeholder="Buscar jugador..."
              aria-label="Search docs for..."
              autoComplete="off"
              data-bd-docs-version="5.1"
              spellCheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
            ></input>
            <datalist id="jugadores_list">
              <option>Jugador</option>
              {jugadores.map((jugador) => {
                return (
                  <option
                    key={jugador.id}
                    value={jugador.id}
                    className="dropdown-item"
                  >
                    {jugador.dni}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              ref={ref.current.fecha}
              defaultValue={modalActualizar.pase.fecha}
              type="date"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Club Salida</label>
            <input
              onChange={handleChangeInsert}
              list="clubes_list"
              type="text"
              readOnly
              className="form-control ds-input"
              name="club_salida"
              ref={ref.current.club_salida}
              value={
                form.jugador
                  ? clubes.find(
                      (c) =>
                        c.id == jugadores.find((j) => j.id == form.jugador).club
                    ).nombre
                  : ""
              }
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Club Llegada</label>
            <input
              onChange={handleChangeInsert}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club_llegada"
              ref={ref.current.club_llegada}
              defaultValue={modalActualizar.pase.club_llegada}
              placeholder="Buscar club..."
              aria-label="Search docs for..."
              autoComplete="off"
              data-bd-docs-version="5.1"
              spellCheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
            ></input>
            <datalist id="clubes_list">
              <option>Todos</option>
              {clubes.map((club) => {
                if (form.club_salida) {
                  if (club.id != form.club_salida) {
                    return (
                      <option
                        key={club.id}
                        value={club.id}
                        className="dropdown-item"
                      >
                        {club.nombre}
                      </option>
                    );
                  }
                }
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Tipo:</label>
            <Form.Control
              name="categoria"
              plaintext
              readOnly
              ref={ref.current.tipo}
              id="tipo"
              defaultValue={
                form.club_llegada && form.club_salida
                  ? tipoDePase(
                      clubes.find((c) => c.id == form.club_salida),
                      clubes.find((c) => c.id == form.club_llegada)
                    )
                  : ""
              }
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => insertar()}>
            Insertar
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => cerrarModalInsertar()}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default PasesCRUD;
