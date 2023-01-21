import React, { useState, useEffect } from 'react'
import { Form, Container, Button, FormControl, FormGroup } from 'react-bootstrap'
import styles from '/src/styles/login/Login.module.css'

import logo from "/src/assets/logo.png";


export default function Login() {
  const token = sessionStorage.getItem("token")
  const [errorDni, setErrorDni] = useState('');
  const [errorContraseña, setErrorContraseña] = useState('');
  const [form, setForm] = useState({
    dni: '',
    contraseña: ''
  });
  const errores = {
    404: "Usuario no encontrado",
    401: 'Contraseña incorrecta',
  }
  const checkUser = () => {
    console.log(form);
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok){
          console.log('no hay error');
          sessionStorage.setItem('token', response.access_token)
          response.json();
          console.log(response);
          location.replace('/')
        }
        else {
          console.log("post error", response);
          if(response.status == 404){
            setErrorDni(errores[response.status])
          }else {
            setErrorContraseña(errores[response.status])
          }
          console.log(response.statusText); 
        }
          
      })
  };

  const handleChangeInsert = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div>
        <div className={styles.blob}></div>
        <div className="pt-5">
          {token && token != ""?
            location.replace('/'): (
              <Container className={styles.login}>
                <img src={logo} />
                <h4>Login</h4>
                <Form>
                    <FormGroup>
                        <FormControl className={errorDni? 'border border-danger':''} required pattern='[0-9]{7,8}' type='number' name='dni' placeholder="Dni" onChange={handleChangeInsert} />
                        <p className='text-danger'>{errorDni}</p>
                        <FormControl className={errorContraseña? 'border border-danger':''} required pattern='' name='contraseña' type="password" placeholder="Contraseña" onChange={handleChangeInsert} />
                        <p className='text-danger'>{errorContraseña}</p>
                        <a href="">Olvidé mi clave</a>
                    </FormGroup>
                    <Button variant="primary" onClick={() => checkUser()}>Ingresar</Button>
                </Form>
            </Container>
            )
          }
            
        </div>
        
    </div>
  )
}
