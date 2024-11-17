import React, { useState } from "react";
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from "sweetalert2";
import axios from "axios";

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const iniciarsession = (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: `Uno o más campos están vacíos`,
                timer: 4000,
            });
        } else {
            // Realizamos el POST al backend para verificar las credenciales
            axios.post("http://localhost:3001/login_admon", { email, password })
                .then(response => {
                    if (response.data.success) {
                        // Si la autenticación es exitosa
                        Swal.fire({
                            title: "Bienvenido!",
                            html: `<strong>${email}</strong> ha iniciado sesión con éxito.`,
                            icon: "success"
                        }).then(() => {
                            // Pasamos el estado autenticado al App.js
                            onLogin(true); // Actualiza el estado en App.js
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: `Correo o contraseña incorrectos.`,
                            icon: "error"
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error!",
                        html: `Hubo un error en la autenticación. Por favor, inténtalo de nuevo.`,
                        icon: "error"
                    });
                });
        }
    }

    return (
        <div className={'mainContainer'}>
            <form>
                <div className={'titleContainer'}>
                    <div>BiblioCloud SM</div>
                </div>

                <div className={'inputContainer'}>
                    <input
                        className={'inputBox'}
                        placeholder="Ingrese su correo aquí"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={'inputContainer'}>
                    <input
                        className={'inputBox'}
                        placeholder="Ingrese su contraseña aquí"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={'inputContainer'}>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={iniciarsession}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
