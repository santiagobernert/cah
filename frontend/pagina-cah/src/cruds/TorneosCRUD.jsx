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

function TorneosCRUD() {
  const [data, setdata] = useState({ torneos: [] });
  const [categorias, setCategorias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    torneo: data.torneos.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    inicio: "",
    fin: "",
    equipos: "",
    ubicacion: "",
    categoria: 0,
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    inicio: useRef(""),
    fin: useRef(""),
    equipos: useRef(""),
    ubicacion: useRef(""),
    categoria: useRef(0),
  });
  useEffect(() => {
    getCategorias();
    getLocalidades();
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

  const getLocalidades = () => {
    fetch("http://localhost:5000/localidad")
      .then((res) => res.json())
      .then((responseJson) => {
        setLocalidades(responseJson.localidades);
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
    fetch("http://localhost:5000/torneo")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/torneo", {
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
    fetch("http://localhost:5000/torneo", {
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
    fetch("http://localhost:5000/torneo", {
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

  const mostrarModalActualizar = (torneo) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, torneo: torneo });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      torneo: modalActualizar.torneo,
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
    let datos = data.torneos;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].inicio = dato.inicio;
        datos[contador].fin = dato.fin;
        datos[contador].equipos = dato.equipos;
        datos[contador].ubicacion = dato.ubicacion;
        datos[contador].categoria = dato.categoria;
      }
      contador++;
    });
    setdata({ torneos: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      torneo: modalActualizar.torneo,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data.torneos;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ torneos: arreglo });
      setmodalActualizar({
        abierto: false,
        torneo: modalActualizar.torneo,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.torneos.length + 1;
    let lista = data.torneos;
    lista.push(valorNuevo);
    setdata({ torneos: lista });
    console.log(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      nombre: ref.current["nombre"].current.value,
      inicio: ref.current["inicio"].current.value,
      fin: ref.current["fin"].current.value,
      equipos: ref.current["equipos"].current.value,
      ubicacion: ref.current["ubicacion"].current.value,
      categoria: ref.current["categoria"].current.value,
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
      data.torneos.map((torneo) => {
        if (
          torneo.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          searchData.push(torneo);
        }
      });
      setdata({ torneos: searchData });
    } else {
      searchData = getData();
    }
    console.log(data.torneos);
  };

  return (
    <>
      <Container>
        <h2>Torneos</h2>
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
              <th>Inicio</th>
              <th>Fin</th>
              <th>Equipos</th>
              <th>Ubicación</th>
              <th>Categoría</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.torneos.map((torneo) => (
              <tr key={torneo.id}>
                <td>{torneo.id}</td>
                <td>{torneo.nombre}</td>
                <td>{torneo.inicio}</td>
                <td>{torneo.fin}</td>
                <td>{torneo.equipos}</td>
                <td>{torneo.ubicacion}</td>
                <td>
                  {categorias.find((c) => c.id == torneo.categoria).nombre}
                </td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(torneo)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(torneo)}>
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
              defaultValue={modalActualizar.torneo.id}
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
              defaultValue={modalActualizar.torneo.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>inicio:</label>
            <input
              className="form-control"
              name="inicio"
              type="date"
              ref={ref.current.inicio}
              defaultValue={modalActualizar.torneo.inicio}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>fin</label>
            <input
              className="form-control"
              name="fin"
              ref={ref.current.fin}
              defaultValue={modalActualizar.torneo.fin}
              type="date"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Equipos:</label>
            <input
              className="form-control"
              name="equipos"
              ref={ref.current.equipos}
              defaultValue={modalActualizar.torneo.equipos}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>


          <FormGroup>
            <label>Ubicación</label>
            <input
              onChange={handleChangeEdit}
              list="localidades_list"
              type="search"
              className="form-control ds-input"
              name="ubicacion"
              ref={ref.current.ubicacion}
              defaultValue={modalActualizar.torneo.ubicacion}
              placeholder="Buscar ubicacion..."
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
            <datalist id="localidades_list">
              <option>Seleccionar</option>
              {localidades.map((ubicacion) => {
                return (
                  <option
                    key={ubicacion.id}
                    value={ubicacion.id}
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
            <input
              onChange={handleChangeEdit}
              list="categorias_list"
              type="search"
              className="form-control ds-input"
              name="categoria"
              ref={ref.current.categoria}
              defaultValue={modalActualizar.torneo.categoria}
              placeholder="Buscar categoria..."
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
            <datalist id="categorias_list">
              <option>Seleccionar</option>
              {categorias.map((categoria) => {
                return (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                    className="dropdown-item"
                  >
                    {categoria.nombre}
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
            <h3>Nuevo torneo</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.torneos.length + 1}
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
            <label>Inicio:</label>
            <input
              className="form-control"
              name="inicio"
              type="date"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Fin</label>
            <input
              className="form-control"
              name="fin"
              type="date"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Equipos:</label>
            <input
              className="form-control"
              name="equipos"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>


          <FormGroup>
            <label>Ubicación</label>
            <input
              onChange={handleChangeInsert}
              list="localidades_list"
              type="search"
              className="form-control ds-input"
              name="ubicacion"
              placeholder="Buscar ubicacion..."
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
            <datalist id="localidades_list">
              <option>Seleccionar</option>
              {localidades.map((ubicacion) => {
                return (
                  <option
                    key={ubicacion.id}
                    value={ubicacion.id}
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
            <input
              onChange={handleChangeInsert}
              list="categorias_list"
              type="search"
              className="form-control ds-input"
              name="categoria"
              placeholder="Buscar categoria..."
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
            <datalist id="categorias_list">
              <option>Seleccionar</option>
              {categorias.map((categoria) => {
                return (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                    className="dropdown-item"
                  >
                    {categoria.nombre}
                  </option>
                );
              })}
            </datalist>
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
export default TorneosCRUD;
