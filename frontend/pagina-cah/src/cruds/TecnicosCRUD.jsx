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

function TecnicosCRUD() {
  const [data, setdata] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    tecnico: data.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    sexo: "",
    asociacion: 0,
    nivel: 0,
    equipos: "",
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    apellido: useRef(""),
    dni: useRef(""),
    nacimiento: useRef(""),
    sexo: useRef(""),
    asociacion: useRef(0),
    nivel: useRef(0),
    equipos: useRef(""),
  });
  useEffect(() => {
    getAsociaciones();
    getEquipos();
    getData();
  }, []);

  const getAsociaciones = () => {
    fetch("http://localhost:5000/asociaciones")
      .then((res) => res.json())
      .then((responseJson) => {
        setAsociaciones(responseJson.asociaciones);
        return responseJson;
      });
  };

  const getEquipos = () => {
    fetch("http://localhost:5000/equipos")
      .then((res) => res.json())
      .then((responseJson) => {
        setEquipos(responseJson.equipos);
        return responseJson;
      });
  };

  const getData = () => {
    fetch("http://localhost:5000/tecnico")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/tecnico", {
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
    fetch("http://localhost:5000/tecnico", {
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
    fetch("http://localhost:5000/tecnico", {
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

  const mostrarModalActualizar = (tecnico) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, tecnico: tecnico });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      tecnico: modalActualizar.tecnico,
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
    let datos = data;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].apellido = dato.apellido;
        datos[contador].dni = dato.dni;
        datos[contador].nacimiento = dato.nacimiento;
        datos[contador].sexo = dato.sexo;
        datos[contador].asociacion = dato.asociacion;
        datos[contador].nivel = dato.nivel;
        datos[contador].equipos = dato.equipos;
      }
      contador++;
    });
    setdata({ tecnicos: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      tecnico: modalActualizar.tecnico,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ tecnicos: arreglo });
      setmodalActualizar({
        abierto: false,
        tecnico: modalActualizar.tecnico,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.length + 1;
    let lista = data;
    lista.push(valorNuevo);
    setdata({ tecnicos: lista });
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
      asociacion: ref.current["asociacion"].current.value,
      nivel: ref.current["nivel"].current.value,
      equipos: ref.current["equipos"].current.value,
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
      data.map((tecnico) => {
        if (
          tecnico.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          searchData.push(tecnico);
        }
      });
      setdata({ tecnicos: searchData });
    } else {
      searchData = getData();
    }
    console.log(data);
  };

  return (
    <>
      <Container>
        <h2>Técnicos</h2>
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
              <th>Asociación</th>
              <th>Nivel</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.map((tecnico) => (
              <tr key={tecnico.id}>
                <td>{tecnico.id}</td>
                <td>{tecnico.nombre}</td>
                <td>{tecnico.apellido}</td>
                <td>{tecnico.dni}</td>
                <td>{tecnico.nacimiento}</td>
                <td>{tecnico.sexo}</td>
                <td>
                  {asociaciones.find((c) => c.id == tecnico.asociacion).nombre}
                </td>
                <td>{tecnico.nivel}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(tecnico)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(tecnico)}>
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
              defaultValue={modalActualizar.tecnico.id}
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
              defaultValue={modalActualizar.tecnico.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              ref={ref.current.apellido}
              defaultValue={modalActualizar.tecnico.apellido}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Dni</label>
            <input
              className="form-control"
              name="dni"
              ref={ref.current.dni}
              defaultValue={modalActualizar.tecnico.dni}
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
              defaultValue={modalActualizar.tecnico.nacimiento}
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
              defaultValue={modalActualizar.tecnico.sexo}
              onChange={handleChangeEdit}
            >
              <option value="seleccionar">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Asociacion:</label>
            <input
              onChange={handleChangeEdit}
              list="asociaciones_list"
              type="search"
              className="form-control ds-input"
              name="asociacion"
              ref={ref.current.asociacion}
              defaultValue={modalActualizar.tecnico.asociacion}
              placeholder="Buscar asociación..."
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
            <datalist id="asociaciones_list">
              <option>Seleccionar</option>
              {asociaciones.map((asociacion) => {
                return (
                  <option
                    key={asociacion.id}
                    value={asociacion.id}
                    className="dropdown-item"
                  >
                    {asociacion.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Nivel</label>
            <input
              onChange={handleChangeEdit}
              list="niveles_list"
              type="search"
              className="form-control ds-input"
              name="nivel"
              ref={ref.current.nivel}
              defaultValue={modalActualizar.tecnico.nivel}
              placeholder="Buscar nivel..."
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
            <datalist id="niveles_list">
              <option>Seleccionar</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Equipos</label>
            <input
              onChange={handleChangeEdit}
              list="equipos_list"
              type="search"
              className="form-control ds-input"
              name="equipo"
              ref={ref.current.equipo}
              defaultValue={modalActualizar.tecnico.equipo}
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
            <h3>Nuevo árbitro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.length + 1}
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
              defaultValue={modalActualizar.tecnico.sexo}
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
            <label>Asociación:</label>
            <Form.Control
              as="select"
              multiple
              className="form-control"
              name="asociacion"
              defaultValue={modalActualizar.tecnico.asociacion}
              onChange={handleChangeInsert}
            >
              {asociaciones.map((asociacion) => {
                return (
                  <option value={asociacion.id} key={asociacion.id}>
                    {asociacion.nombre}
                  </option>
                );
              })}
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <label>Nvel:</label>
            <Form.Control
              as="select"
              multiple
              className="form-control"
              name="nivel"
              defaultValue={modalActualizar.tecnico.nivel}
              onChange={handleChangeInsert}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </Form.Control>
          </FormGroup>
          
          <FormGroup>
            <label>Equipos</label>
            <input
              onChange={handleChangeInsert}
              list="equipos_list"
              type="search"
              className="form-control ds-input"
              name="equipo"
              ref={ref.current.equipo}
              defaultValue={modalActualizar.tecnico.equipo}
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
export default TecnicosCRUD;
