import React, { useState } from 'react'
import { Form, Container, Button, FormControl, FormGroup } from 'react-bootstrap'
import styles from '/src/styles/login/Login.module.css'

import logo from "/src/assets/react.svg";


export default function Login() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getData();
  }, []);


  const getData = () => {
    fetch("http://localhost:5000/usuario")
      .then((res) => res.json())
      .then((responseJson) => {
        setdata(responseJson);
        return responseJson;
      });
  };

  return (
    <div>
        <div className={styles.blob}></div>
        <div className="pt-5">
            <Container className={styles.login}>
                <img src={logo} />
                <h4>Login</h4>
                <Form>
                    <FormGroup>
                        <FormControl placeholder="Usuario" />
                        <FormControl type="password" placeholder="Contraseña" />
                        <a href="">Olvidé mi clave</a>
                    </FormGroup>
                    <Button type="submit" variant="primary" >Ingresar</Button>
                </Form>
            </Container>
        </div>
        
    </div>
  )
}
