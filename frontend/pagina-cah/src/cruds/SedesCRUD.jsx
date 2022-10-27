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
} from "react-bootstrap";

function SedesCRUD() {
  const [data, setdata] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    sede: data.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    club: 0,
    ubicacion: "",
    localidad: "",
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    club: useRef(0),
    ubicacion: useRef(""),
    localidad: useRef(""),
  });
  useEffect(() => {
    getData();
    getClubes();
    getProvincias();
  }, []);

  const getData = () => {
    fetch("http://localhost:5000/sede")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
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

  const getProvincias = () => {
    fetch("http://localhost:5000/provincia")
      .then((res) => res.json())
      .then((responseJson) => {
        setProvincias(responseJson.provincias);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/sede", {
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
    fetch("http://localhost:5000/sede", {
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
    fetch("http://localhost:5000/sede", {
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

  const mostrarModalActualizar = (sede) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, sede: sede });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      sede: modalActualizar.sede,
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
        datos[contador].club = dato.club;
        datos[contador].ubicacion = dato.ubicacion;
        datos[contador].localidad = dato.localidad;
      }
      contador++;
    });
    setdata(datos);
    putData();
    setmodalActualizar({
      abierto: false,
      sede: modalActualizar.sede,
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
      setdata(arreglo);
      setmodalActualizar({
        abierto: false,
        sede: modalActualizar.sede,
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
    setdata(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      id: ref.current["id"].current.value,
      nombre: ref.current["nombre"].current.value,
      club: ref.current["club"].current.value,
      ubicacion: ref.current["ubicacion"].current.value,
      localidad: ref.current["localidad"].current.value,
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
      data.map((sede) => {
        if (sede.nombre.toLowerCase().includes(e.target.value.toLowerCase())) {
          searchData.push(sede);
        }
      });
      setdata(searchData);
    } else {
      searchData = getData();
    }
    console.log(data);
  };

  return (
    <>
      <Container>
        <h2>Sedes</h2>
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
              <th>Club</th>
              <th>Ubicacion</th>
              <th>Localidad</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.map((sede) => (
              <tr key={sede.id}>
                <td>{sede.id}</td>
                <td>{sede.nombre}</td>
                <td>{clubes.find((c) => c.id == sede.club).nombre}</td>
                <td>{sede.ubicacion}</td>
                <td>{sede.localidad}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(sede)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(sede)}>
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
              defaultValue={modalActualizar.sede.id}
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
              defaultValue={modalActualizar.sede.nombre}
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
              defaultValue={modalActualizar.sede.club}
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

          <FormGroup>
            <label>Ubicacion</label>
            <input
              className="form-control"
              name="ubicacion"
              ref={ref.current.ubicacion}
              defaultValue={modalActualizar.sede.ubicacion}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Provincia:</label>
            <select
              className="form-control"
              name="provincia"
              onChange={(e) => setProvincia(e.target.value)}
            >
              <option value="" key="">
                Seleccionar
              </option>
              {provincias.map((provincia) => (
                <option value={provincia.nombre} key={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Localidad:</label>
            <select
              className="form-control"
              name="localidad"
              ref={ref.current.localidad}
              defaultValue={modalActualizar.sede.localidad}
              onChange={handleChangeEdit}
            >
              <option value="" key="">
                Seleccionar
              </option>
              {fetch("http://localhost:5000/localidad", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ provincia: provincia }),
              })
                .then((res) => res.json())
                .then((responseJson) => {
                  setLocalidades(responseJson.localidades);
                })
                .then(
                  localidades.map((localidad) => {
                    return (
                      <option value={localidad.nombre} key={localidad.id}>
                        {localidad.nombre}
                      </option>
                    );
                  })
                )}
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
            <h3>Nueva Sede</h3>
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
            <label>Club</label>
            <input
              onChange={handleChangeInsert}
              list="clubes_list"
              type="search"
              className="form-control ds-input"
              name="club"
              ref={ref.current.club}
              defaultValue={modalActualizar.sede.club}
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

          <FormGroup>
            <label>Ubicacion:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={handleChangeInsert}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Provincia:</label>
            <select
              className="form-control"
              name="provincia"
              onChange={(e) => setProvincia(e.target.value)}
            >
              <option value="" key="">
                Seleccionar
              </option>
              {provincias.map((provincia) => (
                <option value={provincia.nombre} key={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Localidad:</label>
            <select
              className="form-control"
              name="localidad"
              onChange={handleChangeInsert}
            >
              <option value="" key="">
                Seleccionar
              </option>
              {fetch("http://localhost:5000/localidad", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ provincia: provincia }),
              })
                .then((res) => res.json())
                .then((responseJson) => {
                  setLocalidades(responseJson.localidades);
                })
                .then(
                  localidades.map((localidad) => {
                    return (
                      <option value={localidad.nombre} key={localidad.id}>
                        {localidad.nombre}
                      </option>
                    );
                  })
                )}
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
export default SedesCRUD;
