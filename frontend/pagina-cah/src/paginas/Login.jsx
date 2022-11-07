import React, { useState, useEffect } from 'react'
import { Form, Container, Button, FormControl, FormGroup } from 'react-bootstrap'
import styles from '/src/styles/login/Login.module.css'

import logo from "/src/assets/logo.png";


export default function Login() {
  const [errorDni, setErrorDni] = useState('');
  const [errorContraseña, setErrorContraseña] = useState('');
  const [form, setForm] = useState({
    dni: '',
    contraseña: ''
  });

  const checkUser = () => {
    console.log(form);
    fetch(`http://localhost:5000/login?dni=${form.dni}&password=${form.contraseña}`)
      .then((response) => {
        if (response.ok){
          console.log('no hay error');
          response.json();
          console.log(response)
        }
        else {
          console.log("post error", response);
          setErrorContraseña(response)
          console.log(error); 
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
            <Container className={styles.login}>
                <img src={logo} />
                <h4>Login</h4>
                <Form>
                    <FormGroup>
                        <FormControl required pattern='[0-9]{7,8}' type='number' name='dni' placeholder="Dni" onChange={handleChangeInsert} />
                        <h6 className='text-danger'>{errorDni}</h6>
                        <FormControl required pattern='' name='contraseña' type="password" placeholder="Contraseña" onChange={handleChangeInsert} />
                        <h6 className='text-danger'>{errorContraseña}</h6>
                        <a href="">Olvidé mi clave</a>
                    </FormGroup>
                    <Button variant="primary" onClick={() => checkUser()}>Ingresar</Button>
                </Form>
            </Container>
        </div>
        
    </div>
  )
}
