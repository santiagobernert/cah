import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/cruds/Cruds.module.css";
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
} from "react-bootstrap";

function AsociacionesCRUD() {
  const [data, setdata] = useState({ asociaciones: [""] });
  const [provincias, setProvincias] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    asociacion: data.asociaciones.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    abreviatura: "",
    provincia: "",
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    abreviatura: useRef(""),
    provincia: useRef(""),
  });
  useEffect(() => {
    getData();
    getProvincias();
  }, []);

  const getData = () => {
    fetch("http://localhost:8000/asociacion")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  const getProvincias = () => {
    fetch("http://localhost:8000/provincia")
      .then((res) => res.json())
      .then((responseJson) => {
        setProvincias(responseJson.provincias);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:8000/asociacion", {
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
    fetch("http://localhost:8000/asociacion", {
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
    fetch("http://localhost:8000/asociacion", {
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

  const mostrarModalActualizar = (asociacion) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, asociacion: asociacion });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      asociacion: modalActualizar.asociacion,
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
    let datos = data.asociaciones;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].abreviatura = dato.abreviatura;
        datos[contador].provincia = dato.provincia;
      }
      contador++;
    });
    setdata({ asociaciones: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      asociacion: modalActualizar.asociacion,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data.asociaciones;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ asociaciones: arreglo });
      setmodalActualizar({
        abierto: false,
        asociacion: modalActualizar.asociacion,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.asociaciones.length + 1;
    let lista = data.asociaciones;
    lista.push(valorNuevo);
    setdata({ asociaciones: lista });
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      nombre: ref.current["nombre"].current.value,
      abreviatura: ref.current["abreviatura"].current.value,
      provincia: ref.current["provincia"].current.value,
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const search = (e) => {
    let searchData = [];
    if (e.target.value !== "") {
      data.asociaciones.map((asociacion) => {
        if (
          asociacion.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          searchData.push(asociacion);
        }
      });
      setdata({ asociaciones: searchData });
    } else {
      searchData = getData();
    }
    console.log(data.asociaciones);
  };

  return (
    <>
      <Container>
        <h2>Asociaciones</h2>
        <br />
        <div className="d-flex justify-content-between mb-2 pe-4">
          <input
          onChange={(e) => search(e)}
          placeholder="Buscar por nombre"
          className="form-control w-75 me-0"
          type="text"
        />
        <Button
          ms="auto"
          color="success"
          onClick={() => mostrarModalInsertar()}
        >
          Crear
        </Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Abreviatura</th>
              <th>Provincia</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.asociaciones.map((asociacion) => (
              <tr key={asociacion.id}>
                <td>{asociacion.id}</td>
                <td>{asociacion.nombre}</td>
                <td>{asociacion.abreviatura}</td>
                <td>{asociacion.provincia}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(asociacion)}
                  >
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => eliminar(asociacion)}>
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
              defaultValue={modalActualizar.asociacion.id}
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
              defaultValue={modalActualizar.asociacion.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Abreviatura::</label>
            <input
              className="form-control"
              name="abreviatura"
              ref={ref.current.abreviatura}
              defaultValue={modalActualizar.asociacion.abreviatura}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Provincia</label>
            <select
              className="form-control"
              name="asociacion"
              ref={ref.current.provincia}
              defaultValue={modalActualizar.asociacion.provincia}
              onChange={handleChangeEdit}
            >
              {provincias.map((provincia) => {
                return (
                  <option value={provincia.nombre} key={provincia.id}>
                    {provincia.nombre}
                  </option>
                );
              })}
            </select>
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
            <h3>Nueva Asociación</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.asociaciones.length + 1}
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
            <label>Abreviatura:</label>
            <input
              className="form-control"
              name="abreviatura"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Provincia:</label>
            <select
              className="form-control"
              name="asociacion"
              ref={ref.current.asociacion}
              defaultValue={modalActualizar.asociacion.provincia}
              onChange={handleChangeInsert}
            >
              {provincias.map((provincia) => {
                return (
                  <option value={provincia.nombre} key={provincia.id}>
                    {provincia.nombre}
                  </option>
                );
              })}
            </select>
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
export default AsociacionesCRUD;
