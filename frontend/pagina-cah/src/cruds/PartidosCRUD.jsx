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

function PartidosCRUD() {
  const [partidos, setPartidos] = useState([]);
  const [data, setData] = useState({
    categorias: [],
    torneos: [],
    equipos: [],
    arbitros: [],
    mesas: [],
    sedes: [],
  });
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    partido: partidos.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    titulo: "",
    torneo: 0,
    categoria: 0,
    equipoA: 0,
    equipoB: 0,
    arbitro1: 0,
    arbitro2: 0,
    mesa1: 0,
    mesa2: 0,
    sede: 0,
    fecha: "",
    jornada: "",
    resultado: "",
  });
  const ref = useRef({
    id: useRef(1),
    titulo: useRef(""),
    torneo: useRef(0),
    categoria: useRef(0),
    equipoA: useRef(0),
    equipoB: useRef(0),
    arbitro1: useRef(0),
    arbitro2: useRef(0),
    mesa1: useRef(0),
    mesa2: useRef(0),
    sede: useRef(0),
    fecha: useRef(""),
    jornada: useRef(""),
    resultado: useRef(""),
  });
  useEffect(() => {
    getPartidos();
    getData();
  }, []);

  const getPartidos = () => {
    fetch("http://localhost:5000/partidos")
      .then((res) => res.json())
      .then((responseJson) => {
        setData(responseJson);
        return responseJson;
      });
  };

  const getData = () => {
    let categorias = fetch("http://localhost:5000/categorias").then((res) =>
      res.json()
    );
    let torneos = fetch("http://localhost:5000/jugadores").then((res) =>
      res.json()
    );
    let equipos = fetch("http://localhost:5000/equipos").then((res) =>
      res.json()
    );
    let arbitros = fetch("http://localhost:5000/arbitro").then((res) =>
      res.json()
    );
    let mesas = fetch("http://localhost:5000/mesa").then((res) => res.json());
    let sedes = fetch("http://localhost:5000/sede").then((res) => res.json());

    setData({
      categorias: categorias,
      torneos: torneos,
      equipos: equipos,
      arbitros: arbitros,
      mesas: mesas,
      sedes: sedes,
    });
    console.log(data);
  };

  const postData = () => {
    fetch("http://localhost:5000/partido", {
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
    fetch("http://localhost:5000/partido", {
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
    fetch("http://localhost:5000/partido", {
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

  const mostrarModalActualizar = (partido) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, partido: partido });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      partido: modalActualizar.partido,
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
    let datos = partidos;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].id = dato.id;
        datos[contador].titulo = dato.titulo;
        datos[contador].torneo = dato.torneo;
        datos[contador].categoria = dato.categoria;
        datos[contador].equipoA = dato.equipoA;
        datos[contador].equipoB = dato.equipoB;
        datos[contador].arbitro1 = dato.arbitro1;
        datos[contador].arbitro2 = dato.arbitro2;
        datos[contador].mesa1 = dato.mesa1;
        datos[contador].mesa2 = dato.mesa2;
        datos[contador].sede = dato.sede;
        datos[contador].fecha = dato.fecha;
        datos[contador].jornada = dato.jornada;
        datos[contador].resultado = dato.resultado;
      }
      contador++;
    });
    setPartidos(datos);
    putData();
    setmodalActualizar({
      abierto: false,
      partido: modalActualizar.partido,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = partidos;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setPartidos(arreglo);
      setmodalActualizar({
        abierto: false,
        partido: modalActualizar.partido,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = partidos.length + 1;
    let lista = partidos;
    lista.push(valorNuevo);
    setPartidos(lista);
    console.log(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      titulo: ref.current["titulo"].current.value,
      torneo: ref.current["torneo"].current.value,
      categoria: ref.current["categoria"].current.value,
      equipoA: ref.current["equipoA"].current.value,
      equipoB: ref.current["equipoB"].current.value,
      arbitro1: ref.current["arbitro1"].current.value,
      arbitro2: ref.current["arbitro2"].current.value,
      mesa1: ref.current["mesa1"].current.value,
      mesa2: ref.current["mesa2"].current.value,
      sede: ref.current["sede"].current.value,
      fecha: ref.current["fecha"].current.value,
      jornada: ref.current["jornada"].current.value,
      resultado: ref.current["resultado"].current.value,
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form);
  };

  const search = (e) => {
    let searchData = [];
    if (e.target.value !== "") {
      partidos.map((partido) => {
        if (
          partido.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          searchData.push(partido);
        }
      });
      setPartidos(searchData);
    } else {
      searchData = getData();
    }
    console.log(partidos);
  };

  return (
    <>
      <Container>
        <h2>Partidos</h2>
        <br />
        <input
          onChange={(e) => search(e)}
          placeholder="Buscar por nombre"
          type="text"
        />
        <Button
          ms="auto"
          color="success"
          onClick={() => mostrarModalInsertar()}
        >
          Crear
        </Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipo A</th>
              <th>Equipo B</th>
              <th>Torneo</th>
              <th>Sede</th>
              <th>Fecha</th>
              <th>Resultado</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {partidos.map((partido) => (
              <tr key={partido.id}>
                <td>{partido.id}</td>
                <td>{partido.equipoA}</td>
                <td>{partido.equipoB}</td>
                <td>{partido.torneo}</td>
                <td>{partido.sede}</td>
                <td>{partido.fecha}</td>
                <td>{partido.resultado}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(partido)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(partido)}>
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
              defaultValue={modalActualizar.partido.id}
            />
          </FormGroup>

          <FormGroup>
            <label>Titulo:</label>
            <input
              className="form-control"
              name="titulo"
              type="text"
              onChange={handleChangeEdit}
              ref={ref.current.titulo}
              defaultValue={modalActualizar.partido.titulo}
            />
          </FormGroup>

          <FormGroup>
            <label>Equipo A</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="equipoA"
              ref={ref.current.equipoA}
              defaultValue={modalActualizar.partido.equipoA}
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
              <option>Seleccionar</option>
              {data.equipos.map((equipo) => {
                return (
                  <option
                    key={equipo.id}
                    value={equipo.id}
                    className="dropdown-item"
                  >
                    {equipo.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Equipo B</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="equipoB"
              ref={ref.current.equipoB}
              defaultValue={modalActualizar.partido.equipoB}
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
              <option>Seleccionar</option>
              {data.equipos.map((equipo) => {
                return (
                  <option
                    key={equipo.id}
                    value={equipo.id}
                    className="dropdown-item"
                  >
                    {equipo.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Arbitro 1</label>
            <input
              onChange={handleChangeEdit}
              list="arbitros_list"
              type="search"
              className="form-control ds-input"
              name="arbitro1"
              ref={ref.current.arbitro1}
              defaultValue={modalActualizar.partido.arbitro1}
              placeholder="Buscar arbitro..."
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
            <datalist id="arbitros_list">
              <option>Seleccionar</option>
              {data.arbitros.map((arbitro) => {
                return (
                  <option
                    key={arbitro.id}
                    value={arbitro.id}
                    className="dropdown-item"
                  >
                    {arbitro.nombre} {arbitro.appellido}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Arbitro 2</label>
            <input
              onChange={handleChangeEdit}
              list="arbitros_list"
              type="search"
              className="form-control ds-input"
              name="arbitro2"
              ref={ref.current.arbitro2}
              defaultValue={modalActualizar.partido.arbitro2}
              placeholder="Buscar arbitro..."
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
            <datalist id="arbitros_list">
              <option>Seleccionar</option>
              {data.arbitros.map((arbitro) => {
                return (
                  <option
                    key={arbitro.id}
                    value={arbitro.id}
                    className="dropdown-item"
                  >
                    {arbitro.nombre} {arbitro.appellido}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Mesa 1</label>
            <input
              onChange={handleChangeEdit}
              list="mesas_list"
              type="search"
              className="form-control ds-input"
              name="mesa1"
              ref={ref.current.mesa1}
              defaultValue={modalActualizar.partido.mesa1}
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
            <datalist id="mesas_list">
              <option>Seleccionar</option>
              {data.mesas.map((mesa) => {
                return (
                  <option
                    key={mesa.id}
                    value={mesa.id}
                    className="dropdown-item"
                  >
                    {mesa.nombre} {mesa.appellido}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Mesa 2</label>
            <input
              onChange={handleChangeEdit}
              list="mesas_list"
              type="search"
              className="form-control ds-input"
              name="mesa2"
              ref={ref.current.mesa2}
              defaultValue={modalActualizar.partido.mesa2}
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
            <datalist id="mesas_list">
              <option>Seleccionar</option>
              {data.mesas.map((mesa) => {
                return (
                  <option
                    key={mesa.id}
                    value={mesa.id}
                    className="dropdown-item"
                  >
                    {mesa.nombre} {mesa.appellido}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Sede</label>
            <input
              onChange={handleChangeEdit}
              list="sedes_list"
              type="search"
              className="form-control ds-input"
              name="sede"
              ref={ref.current.sede}
              defaultValue={modalActualizar.partido.sede}
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
            <datalist id="sedes_list">
              <option>Seleccionar</option>
              {data.sedes.map((sede) => {
                return (
                  <option
                    key={sede.id}
                    value={sede.id}
                    className="dropdown-item"
                  >
                    {sede.nombre}
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
              defaultValue={modalActualizar.partido.fecha}
              type="date"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Jornada:</label>
            <input
              className="form-control"
              name="jornada"
              ref={ref.current.jornada}
              defaultValue={modalActualizar.partido.jornada}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Resultado:</label>
            <input
              className="form-control"
              name="resultado"
              ref={ref.current.resultado}
              defaultValue={modalActualizar.partido.resultado}
              type="email"
              onChange={handleChangeEdit}
            ></input>
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
            <h3>Nuevo partido</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={partidos.length + 1}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Dni:</label>
            <input
              className="form-control"
              name="dni"
              type="number"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Email:</label>
            <input
              className="form-control"
              name="email"
              type="email"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Contraseña:</label>
            <input
              className="form-control"
              name="contraseña"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Rol:</label>
            <Form.Control
              as="select"
              multiple
              className="form-control"
              name="rol"
              defaultValue={modalActualizar.partido.rol}
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            >
              {partidos.map((rol) => {
                return (
                  <option value={rol.id} key={rol.id}>
                    {rol.nombre}
                  </option>
                );
              })}
            </Form.Control>
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
export default PartidosCRUD;
