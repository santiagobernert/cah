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

function ClubesCRUD() {
  const [clubes, setClubes] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    club: 0,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    asociacion: "",
    nombrecorto: "",
    abreviatura: "",
    escudo: "",
  });
  useEffect(() => {
    getClubes();
    getAsociaciones();
  }, []);

  const getClubes = () => {
    fetch("http://localhost:8000/club")
      .then((res) => res.json())
      .then((responseJson) => {
        console.log(responseJson.clubes);
        setClubes(responseJson.clubes);
        console.log(clubes);
        return responseJson;
      });
  };

  const getAsociaciones = () => {
    fetch("http://localhost:8000/asociacion")
      .then((res) => res.json())
      .then((responseJson) => {
        console.log(responseJson.asociaciones);
        setAsociaciones(responseJson.asociaciones);
        console.log(asociaciones);
        return responseJson;
      });
  };

  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    asociacion: useRef(""),
    nombrecorto: useRef(""),
    abreviatura: useRef(""),
    escudo: useRef(""),
  });

  const postdata = () => {
    fetch("http://localhost:8000/club", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(clubes),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const putData = () => {
    fetch("http://localhost:8000/club", {
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
    fetch("http://localhost:8000/club", {
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

  const getImg = (img) => {
    require(fetch(
      "http://localhost:5000/imagenes/".concat(
        img.substring(12, img.length - 4)
      )
    ));
  };

  const mostrarModalActualizar = (club) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, club: club });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({ abierto: false, club: modalActualizar.club });
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
    console.log(dato);
    let contador = 0;
    let datos = clubes;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].asociacion = dato.asociacion;
        datos[contador].nombrecorto = dato.nombrecorto;
        datos[contador].abreviatura = dato.abreviatura;
        datos[contador].escudo = dato.escudo;
      }
      contador++;
    });
    setClubes(datos);
    putData();
    setmodalActualizar({ abierto: false, club: modalActualizar.club });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = clubes;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setClubes(arreglo);
      deleteData(dato.id);
      setmodalActualizar({ abierto: false, club: modalActualizar.club });
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = clubes.length + 1;
    let lista = clubes;
    lista.push(valorNuevo);
    setClubes(lista);
    postdata();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      nombre: ref.current["nombre"].current.value,
      asociacion: ref.current["asociacion"].current.value,
      nombrecorto: ref.current["nombrecorto"].current.value,
      abreviatura: ref.current["abreviatura"].current.value,
      escudo: ref.current["escudo"].current.value,
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
      clubes.map((club) => {
        if (club.nombre.toLowerCase().includes(e.target.value.toLowerCase())) {
          searchData.push(club);
        }
      });
      setClubes(searchData);
    } else {
      searchData = getClubes();
    }
    console.log(clubes);
  };

  return (
    <>
      <Container>
        <h2>Clubes</h2>
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
        <Table className={styles.tabla}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Asociación</th>
              <th>Corto</th>
              <th>Abreviatura</th>
              <th>Escudo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clubes.map((club) => (
              <tr key={club.id}>
                <td>{club.id}</td>
                <td>{club.nombre}</td>
                <td>
                  {asociaciones.find((a) => a.id == club.asociacion)
                    ? asociaciones.find((a) => a.id == club.asociacion).abreviatura
                    : ""}
                </td>
                <td>{club.nombrecorto}</td>
                <td>{club.abreviatura}</td>
                <td>
                  {" "}
                  <img style={{ width: "5rem" }} src={club.escudo} alt={club.abreviatura} />{" "}
                </td>
                <td className="d-block">
                  <Button
                    color="primary"
                    className="w-100"
                    onClick={() => mostrarModalActualizar(club)}
                  >
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => eliminar(club)}>
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
              defaultValue={modalActualizar.club.id}
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
              defaultValue={modalActualizar.club.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Asociación:</label>
            <select
              className="form-control"
              name="asociacion"
              ref={ref.current.asociacion}
              defaultValue={modalActualizar.club.asociacion}
              onChange={handleChangeEdit}
              style={{
                color: "#121212 !important",
                border: "1px solid #ced4da !important",
              }}
            >
              {asociaciones.map((asociacion) => {
                return (
                  <option value={asociacion.id} key={asociacion.id}>
                    {asociacion.nombre}
                  </option>
                );
              })}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Nombre corto:</label>
            <input
              className="form-control"
              name="nombrecorto"
              ref={ref.current.nombrecorto}
              defaultValue={modalActualizar.club.nombrecorto}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Abreviatura:</label>
            <input
              className="form-control"
              name="abreviatura"
              ref={ref.current.abreviatura}
              defaultValue={modalActualizar.club.abreviatura}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Escudo:</label>
            <input
              className="form-control"
              name="escudo"
              ref={ref.current.escudo}
              files={modalActualizar.club.escudo}
              type="file"
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
            <h3>Nuevo Club</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={clubes.length + 1}
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
            <label>Asociación:</label>
            <select
              className="form-control"
              name="asociacion"
              onSelect={handleChangeInsert}
              onChange={handleChangeInsert}
              defaultValue="Seleccionar"
            >
              <option>Seleccionar</option>
              {asociaciones.map((asociacion) => {
                return (
                  <option value={asociacion.id} key={asociacion.id}>
                    {asociacion.nombre}
                  </option>
                );
              })}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Nombre corto:</label>
            <input
              className="form-control"
              name="nombrecorto"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Abreviatura:</label>
            <input
              className="form-control"
              name="abreviatura"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Escudo:</label>
            <input
              className="form-control"
              name="escudo"
              type="file"
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
export default ClubesCRUD;
