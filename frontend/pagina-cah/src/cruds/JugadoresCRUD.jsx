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

function JugadoresCRUD() {
  const [data, setdata] = useState({ jugadores: [] });
  const [categorias, setCategorias] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    jugador: data.jugadores.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    sexo: "",
    equipo: 0,
    categoria: 0,
    club: 0,
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    apellido: useRef(""),
    dni: useRef(""),
    nacimiento: useRef(""),
    sexo: useRef(""),
    equipo: useRef(0),
    categoria: useRef(0),
    club: useRef(0),
  });
  useEffect(() => {
    getCategorias();
    getClubes();
    getEquipos();
    getData();
    console.log(clubes, categorias);
  }, []);

  const getCategorias = () => {
    fetch("http://localhost:5000/categorias")
      .then((res) => res.json())
      .then((responseJson) => {
        setCategorias(responseJson.categorias);
        return responseJson;
      });
  };

  const getClubes = () => {
    fetch("http://localhost:5000/club")
      .then((res) => res.json())
      .then((responseJson) => {
        setClubes(responseJson.clubes);
        return responseJson;
      });
  };

  const getEquipos = () => {
    fetch("http://localhost:5000/equipo")
      .then((res) => res.json())
      .then((responseJson) => {
        setEquipos(responseJson.equipos);
        return responseJson;
      });
  };

  const getData = () => {
    fetch("http://localhost:5000/jugador")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/jugador", {
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
    fetch("http://localhost:5000/jugador", {
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
    fetch("http://localhost:5000/jugador", {
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

  const mostrarModalActualizar = (jugador) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, jugador: jugador });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      jugador: modalActualizar.jugador,
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
    let datos = data.jugadores;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].apellido = dato.apellido;
        datos[contador].dni = dato.dni;
        datos[contador].nacimiento = dato.nacimiento;
        datos[contador].sexo = dato.sexo;
        datos[contador].equipo = dato.equipo;
        datos[contador].categoria = dato.categoria;
        datos[contador].club = dato.club;
      }
      contador++;
    });
    setdata({ jugadores: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      jugador: modalActualizar.jugador,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data.jugadores;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ jugadores: arreglo });
      setmodalActualizar({
        abierto: false,
        jugador: modalActualizar.jugador,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.jugadores.length + 1;
    let lista = data.jugadores;
    lista.push(valorNuevo);
    setdata({ jugadores: lista });
    console.log(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      nombre: ref.current["nombre"].current.value,
      apellido: ref.current["apellido"].current.value,
      dni: ref.current["dni"].current.value,
      nacimiento: ref.current["nacimiento"].current.value,
      sexo: ref.current["sexo"].current.value,
      equipo: ref.current["equipo"].current.value,
      categoria: ref.current["categoria"].current.value,
      club: ref.current["club"].current.value,
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
      categoria: ref.current["categoria"].current.value
        ? categorias.find(
            (c) => c.nombre === ref.current["categoria"].current.value
          ).id
        : "",
    });
    console.log(form);
  };

  const search = (e) => {
    let searchData = [];
    if (e.target.value !== "") {
      data.jugadores.map((jugador) => {
        if (
          jugador.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          searchData.push(jugador);
        }
      });
      setdata({ jugadores: searchData });
    } else {
      searchData = getData();
    }
    console.log(data.jugadores);
  };

  return (
    <>
      <Container>
        <h2>Jugadores</h2>
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
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Dni</th>
              <th>Nacimiento</th>
              <th>Sexo</th>
              <th>Equipo</th>
              <th>Categoría</th>
              <th>Club</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.jugadores.map((jugador) => (
              <tr key={jugador.id}>
                <td>{jugador.id}</td>
                <td>{jugador.nombre}</td>
                <td>{jugador.apellido}</td>
                <td>{jugador.dni}</td>
                <td>{jugador.nacimiento}</td>
                <td>{jugador.sexo}</td>
                <td>{equipos.find((e) => e.id == jugador.equipo).nombre}</td>
                <td>
                  {categorias.find((c) => c.id == jugador.categoria).nombre}
                </td>
                <td>{clubes.find((c) => c.id == jugador.club).nombre}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(jugador)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(jugador)}>
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
              defaultValue={modalActualizar.jugador.id}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              onChange={handleChangeEdit}
              ref={ref.current.nombre}
              defaultValue={modalActualizar.jugador.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              ref={ref.current.apellido}
              defaultValue={modalActualizar.jugador.apellido}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Dni</label>
            <input
              className="form-control"
              name="dni"
              ref={ref.current.dni}
              defaultValue={modalActualizar.jugador.dni}
              type="number"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Nacimiento:</label>
            <input
              className="form-control"
              name="nacimiento"
              ref={ref.current.nacimiento}
              defaultValue={modalActualizar.jugador.nacimiento}
              type="date"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Sexo</label>
            <select
              className="form-control"
              name="sexo"
              ref={ref.current.sexo}
              defaultValue={modalActualizar.jugador.sexo}
              onChange={handleChangeEdit}
            >
              <option value="seleccionar">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Equipo</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="equipo"
              ref={ref.current.equipo}
              defaultValue={modalActualizar.jugador.equipo}
              placeholder="Buscar equipo..."
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
            <datalist id="equipos_list">
              <option>Seleccionar</option>
              {equipos.map((equipo) => {
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
            <label>Categoría</label>
            <Form.Control
              name="categoria"
              plaintext
              readOnly
              defaultValue={modalActualizar.jugador.categoria}
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
              placeholder={
                form.nacimiento
                  ? categorias.find((c) =>
                      c.años.includes(new Date(form.nacimiento).getFullYear())
                    ).nombre
                  : ""
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Club</label>
            <input
              onChange={handleChangeEdit}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club"
              ref={ref.current.club}
              defaultValue={modalActualizar.jugador.club}
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
            <h3>Nuevo Jugador</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.jugadores.length + 1}
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
            <label>Nacimiento:</label>
            <input
              className="form-control"
              name="nacimiento"
              type="date"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Sexo:</label>
            <select
              defaultValue={modalActualizar.jugador.sexo}
              className="form-control"
              name="sexo"
              onChange={handleChangeInsert}
            >
              <option value="seleccionar">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Equipo:</label>
            <Form.Control
              as="select"
              multiple
              className="form-control"
              name="equipo"
              defaultValue={modalActualizar.jugador.equipo}
              onChange={handleChangeInsert}
            >
              {equipos.map((equipo) => {
                return (
                  <option value={equipo.id} key={equipo.id}>
                    {equipo.nombre}
                  </option>
                );
              })}
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <label>Categoría:</label>
            <Form.Control
              name="categoria"
              plaintext
              readOnly
              ref={ref.current.categoria}
              id="categoria"
              defaultValue={
                form.nacimiento
                  ? categorias.find((c) =>
                      c.años.includes(new Date(form.nacimiento).getFullYear())
                    ).nombre
                  : ""
              }
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            />
          </FormGroup>

          <FormGroup>
            <label>Club:</label>
            <Form.Control
              as="select"
              multiple
              className="form-control"
              name="club"
              defaultValue={modalActualizar.jugador.club}
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            >
              {clubes.map((club) => {
                return (
                  <option value={club.id} key={club.id}>
                    {club.nombre}
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
export default JugadoresCRUD;
