import React, { useEffect, useRef, useState } from "react";
import useDrivePicker from 'react-google-drive-picker'
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
  Row,
  Col
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
  const [modalCargar, setmodalCargar] = useState(false);
  const [modalJugador, setmodalJugador] = useState({
    abierto: false,
    jugador: data.jugadores.length,
  });
  const [openPicker, sheet, authResponse] = useDrivePicker();
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
    categoria: useRef("0"),
    club: useRef(0),
  });
  const [planilla, setplanilla] = useState('');
  useEffect(() => {
    getCategorias();
    getClubes();
    getEquipos();
    getData();
  }, []);

  const getCategorias = () => {
    fetch("http://localhost:8000/categoria")
      .then((res) => res.json())
      .then((responseJson) => {
        setCategorias(responseJson.categorias);
        return responseJson;
      });
  };

  const getClubes = () => {
    fetch("http://localhost:8000/club")
      .then((res) => res.json())
      .then((responseJson) => {
        setClubes(responseJson.clubes);
        return responseJson;
      });
  };

  const getEquipos = () => {
    fetch("http://localhost:8000/equipo")
      .then((res) => res.json())
      .then((responseJson) => {
        setEquipos(responseJson.equipos);
        return responseJson;
      });
  };

  const getData = () => {
    fetch("http://localhost:8000/jugador")
      .then((res) => res.json())
      .then((responseJson) => {
        responseJson.jugadores.forEach((j)=>{
          j.nacimiento = `${new Date(j.nacimiento).getFullYear()}-${new Date(j.nacimiento).getMonth() < 10? '0' + (new Date(j.nacimiento).getMonth() + 1): new Date(j.nacimiento).getMonth() + 1}-${new Date(j.nacimiento).getDate() + 1}`
        })
        setdata(responseJson);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:8000/jugador", {
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
    fetch("http://localhost:8000/jugador", {
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
    fetch("http://localhost:8000/jugador", {
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
    setform({
      id: jugador.id,
      nombre: jugador.nombre,
      apellido: jugador.apellido,
      dni: jugador.dni,
      nacimiento: jugador.nacimiento,
      sexo: jugador.sexo,
      equipo: jugador.equipo,
      categoria: jugador.categoria,
      club: jugador.club,
    })
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
    setmodalInsertar(false);
  };

  const mostrarModalCargar = () => {
    setmodalCargar(true);
  };

  const cerrarModalCargar = () => {
    setmodalCargar(false);
  };

  const mostrarModalJugador = (jugador) => {
    console.log("mostrar Jugador");
    setmodalJugador({ abierto: true, jugador: jugador });
  };

  const cerrarModalJugador = () => {
    console.log("cerrar Jugador");
    setmodalJugador({
      abierto: false,
      jugador: modalActualizar.jugador,
    });
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

  const cargarPlanilla = () => {
    setmodalCargar(false);
    fetch("http://localhost:8000/jugador/planilla", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(planilla),
    })
      .then((response) => response.json()).then(responseJson => setdata(responseJson))
      .catch((error) => console.log("post", error));

  }

  const handleChangeEdit = (e) => {
    console.log("ref cat",ref.current["categoria"].current.value);
    console.log(new Date(ref.current["nacimiento"].current.value).getFullYear());
    setform({
      ...form,
      [e.target.name]: e.target.value,
      categoria: ref.current["nacimiento"].current.value? categorias.find((c) =>
      c.años.includes(new Date(ref.current["nacimiento"].current.value).getFullYear())
    ).nombre
  : "",
    });
  };

  const handleChangeInsert = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
      categoria: form.nacimiento? categorias.find((c) =>
          c.años.includes(new Date(form.nacimiento).getFullYear())
        ).nombre
      : "",
    });
    console.log(form);
  };

  const handleChangeCargar = (e) => {
    setplanilla(e.target.value);
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId: "865613334786-25eotn5emqi1ufg9cqt2nv0o9u7a28h1.apps.googleusercontent.com",
      developerKey: "AIzaSyBq9U2LIqjsufEWQ0tPnGsGauONmRU-CO8",
      token: 'ya29.a0AeTM1iek8IS8ZNl1P17T9jCD1SCmGiQyburUTitlaMgNdw3syUnwSEY2dw-QCRTBSsE23w53gUbzkaga1-CRGWjtV8ci0oG27dNsBw-plk9F3Gix2fRkL-_l-jGBmNkpJ5ouYw3_-kmgZjaGRQ7wB4L6-eA1aCgYKAUkSARMSFQHWtWOm6P-xOFjKJkbqgBvdqTVLCQ0163',
      viewId: "SPREADSHEETS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false
    })
  }

  const search = (e) => {
    let searchData = [];
    if (e.target.value !== "") {
      data.jugadores.map((jugador) => {
        if (
          jugador.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
          jugador.apellido.toLowerCase().includes(e.target.value.toLowerCase())
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
        <div className="d-flex align-items-center justify-content-between mb-2 pe-2">
          <input
            onChange={(e) => search(e)}
            className='form-control w-75 me-1'
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
          <Button
            ms="auto"
            color="success"
            onClick={() => mostrarModalCargar()}
          >
            Cargar planilla
          </Button>
        </div>
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
              <tr onClick={()=>mostrarModalJugador(jugador)} key={jugador.id}>
                <td>{jugador.id}</td>
                <td>{jugador.nombre}</td>
                <td>{jugador.apellido}</td>
                <td>{jugador.dni}</td>
                <td>{jugador.nacimiento}</td>
                <td>{jugador.sexo}</td>
                <td>{jugador.equipo? equipos.find((e) => e.id == jugador.equipo).nombre:''}</td>
                <td>
                  {jugador.categoria}
                </td>
                <td>{jugador.club}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(jugador)}
                  >
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => eliminar(jugador)}>
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
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
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
              defaultValue={form.nacimiento
                ? categorias.find((c) =>
                    c.años.includes(new Date(form.nacimiento).getFullYear())
                  ).nombre
                : modalActualizar.jugador.categoria}
              ref={ref.current.categoria}
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
                    value={club.nombre}
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
      
      <Modal show={modalCargar}>
        <ModalHeader>
          <div>
            <h3>Cargar datos</h3>
          </div>
        </ModalHeader>

        <ModalBody>
            <div className="form-group">
              <label>Link de la planilla</label>
              <input
              className="form-control mb-2"
              name="planilla"
              type="text"
              onChange={handleChangeCargar}
              />
              <button color='primary' onClick={() => handleOpenPicker()}>Subir desde Drive</button>
            </div>
          

        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => cargarPlanilla()}>
            Cargar
          </Button>
          <Button color="danger" onClick={() => cerrarModalCargar()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal dialogClassName="w-75 mw-80" show={modalJugador.abierto}>
        <ModalHeader>
          <div><h3>{`${modalJugador.jugador.nombre} ${modalJugador.jugador.apellido}`}</h3></div>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <div className="container">
                  <label>Fecha de nacimiento:</label>
                  <p className="bold">{modalJugador.jugador.nacimiento}</p>
                </div>
              </Col>
              <Col>
                <div className="container">
                  <label>Categoría:</label>
                  <p className="bold">{modalJugador.jugador.categoria}</p>
                </div>
              </Col>
              <Col>
                <div className="container">
                  <label>Club:</label>
                  <p className="bold">{modalJugador.jugador.club}</p>
                </div>
              </Col>
            </Row>
          </ModalBody>
      </Modal>

    </>
  );
}
export default JugadoresCRUD;
