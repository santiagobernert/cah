import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/cruds/Cruds.module.css";
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

function ArticulosCRUD() {
  const [articulos, setArticulos] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    partido: articulos.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    titulo: "",
    portada: "",
    tags: "",
    cuerpo: "",
    fecha: "",
  });
  const [filter, setfilter] = useState({titulo:'', club:'', torneo:''});
  const ref = useRef({
    id: useRef(1),
    titulo: useRef(""),
    portada: useRef(""),
    tags: useRef(""),
    cuerpo: useRef(""),
    fecha: useRef(""),
  });
  useEffect(() => {
    getArticulos();
  }, []);

  const getArticulos = () => {
    fetch("http://localhost:8000/articulo")
      .then((res) => res.json())
      .then((responseJson) => {
        setArticulos(responseJson.articulos);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:8000/articulo", {
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
    fetch("http://localhost:8000/articulo", {
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
    fetch("http://localhost:8000/articulo", {
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
    let datos = articulos;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].id = dato.id;
        datos[contador].titulo = dato.titulo;
        datos[contador].portada = dato.portada;
        datos[contador].tags = dato.tags;
        datos[contador].cuerpo = dato.cuerpo;
        datos[contador].fecha = dato.fecha;
      }
      contador++;
    });
    setArticulos(datos);
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
      let arreglo = articulos;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setArticulos(arreglo);
      setmodalActualizar({
        abierto: false,
        partido: modalActualizar.partido,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    let valorNuevo = form;
    valorNuevo.id = articulos.length + 1;
    let lista = articulos;
    lista.push(valorNuevo);
    setArticulos(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      titulo: ref.current["titulo"].current.value,
      portada: ref.current["portada"].current.value,
      tags: ref.current["tags"].current.value,
      cuerpo: ref.current["cuerpo"].current.value,
      fecha: ref.current["fecha"].current.value,
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const search = (e, value) => {
    let searchData = [];
    if (!filter.titulo && !filter.club && !filter.torneo){
      searchData = getArticulos();
    } else {
    if (e.target.value !== "") {
      setfilter({...filter, [value]: e.target.value})
    }
      articulos.map((partido) => {
        if (
          filter.titulo?partido.titulo.toLowerCase().includes(filter.titulo.toLowerCase()):true &&
          filter.fecha?partido.fecha.toLowerCase().includes(filter.fecha.toLowerCase()):true
        ) {
          searchData.push(partido);
        }
      });
      setArticulos(searchData);
    }
  };

  return (
    <>
      <Container>
        <h2>Articulos</h2>
        <br />
        <div className="d-flex justify-content-between mb-2 pe-4">
          <input
          onChange={(e) => search(e, 'titulo')}
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
              <th>Titulo</th>
              <th>Portada</th>
              <th>Tags</th>
              <th>Cuerpo</th>
              <th>Fecha</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {articulos.map((partido) => (
              <tr key={partido.id}>
                <td>{partido.id}</td>
                <td>{partido.titulo}</td>
                <td>{partido.portada}</td>
                <td>{partido.tags}</td>
                <td>{partido.cuerpo}</td>
                <td>{partido.fecha}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(partido)}
                  >
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => eliminar(partido)}>
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
            <label>Portada:</label>
            <input
              className="form-control"
              name="portada"
              type="text"
              onChange={handleChangeEdit}
              ref={ref.current.portada}
              defaultValue={modalActualizar.partido.portada}
            />
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
            <label>Tags:</label>
            <input
              className="form-control"
              name="tags"
              ref={ref.current.tags}
              defaultValue={modalActualizar.partido.tags}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Cuerpo:</label>
            <input
              className="form-control"
              name="cuerpo"
              ref={ref.current.cuerpo}
              defaultValue={modalActualizar.partido.cuerpo}
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
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Portada:</label>
            <input
              className="form-control"
              name="portada"
              type="text"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              type="date"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Tags:</label>
            <input
              className="form-control"
              name="tags"
              onChange={handleChangeInsert}
            />
          </FormGroup>

          <FormGroup>
            <label>Cuerpo:</label>
            <input
              className="form-control"
              name="cuerpo"
              type="text"
              onChange={handleChangeInsert}
            ></input>
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
export default ArticulosCRUD;
