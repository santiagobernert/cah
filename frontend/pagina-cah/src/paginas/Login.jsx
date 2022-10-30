import React, { useState, useEffect } from 'react'
import { Form, Container, Button, FormControl, FormGroup } from 'react-bootstrap'
import styles from '/src/styles/login/Login.module.css'

import logo from "/src/assets/logo.png";


export default function Login() {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    dni: '',
    contraseña: ''
  });

  const checkUser = () => {
    console.log(form);
    fetch("http://localhost:5000/login", {
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
          response.json();
          console.log(response)
        }
        else {
          console.log("post error", response);
          setError(response)
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
                        <FormControl name='dni' placeholder="Dni" onChange={handleChangeInsert} />
                        <FormControl name='contraseña' type="password" placeholder="Contraseña" onChange={handleChangeInsert} />
                        <h6 className='text-danger'>{error}</h6>
                        <a href="">Olvidé mi clave</a>
                    </FormGroup>
                    <Button variant="primary" onClick={() => checkUser()}>Ingresar</Button>
                </Form>
            </Container>
        </div>
        
    </div>
  )
}
