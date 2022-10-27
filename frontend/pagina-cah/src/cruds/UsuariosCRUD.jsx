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

function UsuariosCRUD() {
  const [data, setdata] = useState({ usuarios: [""] });
  const [roles, setRoles] = useState([]);
  const [modalActualizar, setmodalActualizar] = useState({
    abierto: false,
    usuario: data.usuarios.length,
  });
  const [modalInsertar, setmodalInsertar] = useState(false);
  const [form, setform] = useState({
    id: 1,
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    contraseña: "",
    rol: 0,
  });
  const ref = useRef({
    id: useRef(0),
    nombre: useRef(""),
    apellido: useRef(""),
    dni: useRef(""),
    email: useRef(""),
    contraseña: useRef(""),
    rol: useRef(0),
  });
  useEffect(() => {
    getRoles();
    getData();
  }, []);

  const getRoles = () => {
    fetch("http://localhost:5000/roles")
      .then((res) => res.json())
      .then((responseJson) => {
        setRoles(responseJson);
        return responseJson;
      });
  };

  const getData = () => {
    fetch("http://localhost:5000/usuario")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  const postData = () => {
    fetch("http://localhost:5000/usuario", {
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
    fetch("http://localhost:5000/usuario", {
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
    fetch("http://localhost:5000/usuario", {
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

  const mostrarModalActualizar = (usuario) => {
    console.log("mostrar actualizar");
    setmodalActualizar({ abierto: true, usuario: usuario });
  };

  const cerrarModalActualizar = () => {
    console.log("cerrar actualizar");
    setmodalActualizar({
      abierto: false,
      usuario: modalActualizar.usuario,
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
    let datos = data.usuarios;
    datos.map((registro) => {
      if (dato.id == registro.id) {
        datos[contador].nombre = dato.nombre;
        datos[contador].apellido = dato.apellido;
        datos[contador].dni = dato.dni;
        datos[contador].email = dato.email;
        datos[contador].contraseña = dato.contraseña;
        datos[contador].rol = dato.rol;
      }
      contador++;
    });
    setdata({ usuarios: datos });
    putData();
    setmodalActualizar({
      abierto: false,
      usuario: modalActualizar.usuario,
    });
  };

  const eliminar = (dato) => {
    console.log("eliminar");
    let opcion = window.confirm(
      "Estás seguro que deseas eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      let contador = 0;
      let arreglo = data.usuarios;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      setdata({ usuarios: arreglo });
      setmodalActualizar({
        abierto: false,
        usuario: modalActualizar.usuario,
      });
      deleteData(dato.id);
    }
  };

  const insertar = () => {
    console.log("insertar");
    console.log(form);
    let valorNuevo = form;
    valorNuevo.id = data.usuarios.length + 1;
    let lista = data.usuarios;
    lista.push(valorNuevo);
    setdata({ usuarios: lista });
    console.log(lista);
    postData();
    setmodalInsertar(false);
  };

  const handleChangeEdit = (e) => {
    setform({
      'id': ref.current['id'].current.value,
      'nombre': ref.current['nombre'].current.value,
      'apellido': ref.current['apellido'].current.value,
      'dni': ref.current['dni'].current.value,
      'email': ref.current['email'].current.value,
      'contraseña': ref.current['contraseña'].current.value,
      'rol': ref.current['rol'].current.value,
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
    if (e.target.value !== ""){
      data.usuarios.map(usuario => {
      if (usuario.nombre.toLowerCase().includes(e.target.value.toLowerCase())){
        searchData.push(usuario)
      }
    })
    setdata({usuarios: searchData})
    }else{
      searchData = getData()
    }
    console.log(data.usuarios);
    };

  return (
    <>
      <Container>
        <h2>Usuarios</h2>
        <br />
        <input onChange={(e) => search(e)} placeholder="Buscar por nombre" type="text" />
        <Button ms="auto" color="success" onClick={() => mostrarModalInsertar()}>
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
              <th>Email</th>
              <th>Contraseña</th>
              <th>Rol</th>
              <th>_</th>
            </tr>
          </thead>

          <tbody>
            {data.usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.dni}</td>
                <td>{usuario.email}</td>
                <td>{usuario.contraseña}</td>
                <td>{usuario.rol?roles.find(r => r.id == usuario.rol).letra:''}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => mostrarModalActualizar(usuario)}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(usuario)}>
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
              defaultValue={modalActualizar.usuario.id}
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
              defaultValue={modalActualizar.usuario.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              ref={ref.current.apellido}
              defaultValue={modalActualizar.usuario.apellido}
              onChange={handleChangeEdit}
            />
          </FormGroup>

          <FormGroup>
            <label>Dni</label>
            <input
              className="form-control"
              name="dni"
              ref={ref.current.dni}
              defaultValue={modalActualizar.usuario.dni}
              type="number"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Email:</label>
            <input
              className="form-control"
              name="email"
              ref={ref.current.email}
              defaultValue={modalActualizar.usuario.email}
              type="email"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Contraseña</label>
            <input
              className="form-control"
              name="contraseña"
              ref={ref.current.contraseña}
              defaultValue={modalActualizar.usuario.contraseña}
              type="text"
              onChange={handleChangeEdit}
            ></input>
          </FormGroup>

          <FormGroup>
            <label>Rol</label>
            <select
              className="form-control"
              name="rol"
              ref={ref.current.rol}
              defaultValue={modalActualizar.usuario.rol}
              onChange={handleChangeEdit}
            >
              {roles.map(rol => {
                return(
                  <option value={rol.id} key={rol.id}>{rol.nombre}</option>
                )
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
            <h3>Nuevo Usuario</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={data.usuarios.length + 1}
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
              defaultValue={modalActualizar.usuario.rol}
              onChange={handleChangeInsert}
              style={{color: "#121212 !important", border:"1px solid #ced4da !important"}}
            >
              {roles.map(rol => {
                return(
                  <option value={rol.id} key={rol.id}>{rol.nombre}</option>
                )
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
export default UsuariosCRUD;
