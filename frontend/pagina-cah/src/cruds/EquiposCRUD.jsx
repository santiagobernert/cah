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

function EquiposCRUD() {
  const [clubes, setClubes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    equipo: 0,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    club: "",
    equipo: "",
    año: "",
    jugadores: "",
    tecnicos: "",
    refuerzos: "",
  });
  useEffect(() => {
    getClubes();
    getEquipos();
    getCategorias();
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

  const getEquipos = () => {
    fetch("http://localhost:8000/equipo")
      .then((res) => res.json())
      .then((responseJson) => {
        console.log(responseJson.equipos);
        setEquipos(responseJson.equipos);
        console.log(equipos);
        return responseJson;
      });
  };

  const getCategorias = () => {
    fetch("http://localhost:8000/categoria")
      .then((res) => res.json())
      .then((responseJson) => {
        console.log(responseJson.categorias);
        setCategorias(responseJson.categorias);
        console.log(categorias);
        return responseJson;
      });
  };

  const ref = useRef({
    id: useRef(0),
    club: useRef(""),
    categoria: useRef(""),
    año: useRef(""),
    jugadores: useRef(""),
    tecnicos: useRef(""),
    refuerzos: useRef(""),
  });

  const postdata = () => {
    fetch("http://localhost:8000/equipo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(equipos),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const putData = () => {
    fetch("http://localhost:8000/equipo", {
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
    fetch("http://localhost:8000/equipo", {
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


  const mostrarModalActualizar = (equipo) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, equipo: equipo });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({ abierto: false, equipo: modalActualizar.equipo });
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
    let datos = equipos;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].club = dato.club;
        datos[contador].categoria = dato.categoria;
        datos[contador].año = dato.año;
        datos[contador].jugadores = dato.jugadores;
        datos[contador].tecnicos = dato.tecnicos;
        datos[contador].refuerzos = dato.refuerzos;
      }
      contador++;
    });
    setEquipos(datos);
    putData();
    setmodalActualizar({ abierto: false, equipo: modalActualizar.equipo });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = equipos;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setEquipos(arreglo);
      deleteData(dato.id);
      setmodalActualizar({ abierto: false, equipo: modalActualizar.equipo });
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = equipos.length + 1;
    let lista = equipos;
    lista.push(valorNuevo);
    setEquipos(lista);
    postdata();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      club: ref.current["club"].current.value,
      categoria: ref.current["categoria"].current.value,
      año: ref.current["año"].current.value,
      jugadores: ref.current["jugadores"].current.value,
      tecnicos: ref.current["tecnicos"].current.value,
      refuerzos: ref.current["refuerzos"].current.value,
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
      equipos.map((equipo) => {
        if (equipo.club.toLowerCase().includes(e.target.value.toLowerCase())) {
          searchData.push(equipo);
        }
      });
      setEquipos(searchData);
    } else {
      searchData = getEquipos();
    }
    console.log(equipos);
  };

  return (
    <>
      <Container>
        <h2>Equipo</h2>
        <br />
        <div className="d-flex justify-content-between mb-2 pe-4">
          <input
          onChange={(e) => search(e)}
          placeholder="Buscar por club"
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
              <th>Club</th>
              <th>Categoría</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {equipos.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.id}</td>
                <td>{equipo.club}</td>
                <td>{equipo.categoria}</td>
                <td>{equipo.año}</td>
                <td className="d-block">
                  <Button
                    color="primary"
                    className="w-100"
                    onClick={() => mostrarModalActualizar(equipo)}
                  >
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => eliminar(equipo)}>
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
              defaultValue={modalActualizar.equipo.id}
            />
          </FormGroup>

          <FormGroup>
            <label>Club:</label>
            <input
              className="form-control"
              name="club"
              type="text"
              onChange={handleChangeEdit}
              ref={ref.current.club}
              defaultValue={modalActualizar.equipo.club}
            />
          </FormGroup>

          <FormGroup>
          <label>Categoría</label>
            <input
              onChange={handleChangeInsert}
              list="categorias_list"
              type="search"
              className="form-control ds-input"
              name="categoria"
              placeholder="Buscar categoría..."
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
                    value={categoria.nombre}
                    className="dropdown-item"
                  >
                    {categoria.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Año:</label>
            <input
              className="form-control"
              name="año"
              ref={ref.current.año}
              defaultValue={modalActualizar.equipo.año}
              type="text"
              maxLength='4'
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Jugadores:</label>
            <input
              className="form-control"
              name="jugadores"
              ref={ref.current.jugadores}
              defaultValue={modalActualizar.equipo.jugadores}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Técnicos:</label>
            <input
              className="form-control"
              name="tecnicos"
              ref={ref.current.tecnicos}
              files={modalActualizar.equipo.tecnicos}
              type="file"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => editar(form)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => cerrarModalActualizar()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Nuevo Equipo</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={equipos.length + 1}
            />
          </FormGroup>

          <FormGroup>
          <label>Club:</label>
            <input
              onChange={handleChangeInsert}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club"
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
                    value={club.nombre}
                    className="dropdown-item"
                  >
                    {club.nombre}
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
              placeholder="Buscar categoría..."
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
                    value={categoria.nombre}
                    className="dropdown-item"
                  >
                    {categoria.nombre}
                  </option>
                );
              })}
            </datalist>
          </FormGroup>

          <FormGroup>
            <label>Año:</label>
            <input
              className="form-control"
              name="año"
              type="text"
              maxLength='4'
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Jugadores:</label>
            <input
              className="form-control"
              name="jugadores"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Técnicos:</label>
            <input
              className="form-control"
              name="tecnicos"
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
            variant="danger"
            onClick={() => cerrarModalInsertar()}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default EquiposCRUD;
