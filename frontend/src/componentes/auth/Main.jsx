import { useState } from "react";
import axios from "axios";

import CrearCuenta from "./crearcuenta";
import IniciarSesion from "./iniciarsesion";
import { Route, useLocation } from "wouter";


export default function AuthMain() {

    const [mensaje, setMensaje] = useState("");
    const [location, setLocation] = useLocation();

    const registrar = async (usuario) => {
        try {
            const datos = {
                nombre: usuario.nombreUsuario.trim(),
                nombre_usuario: usuario.nombreUsuario.trim(),
                correo: usuario.correo.trim(),
                contrasena: usuario.contrasenaHash.trim(),
                biografia: "",
                url_avatar: "",
            };

            await axios.post("http://localhost:3000/api/usuarios/registro", datos);

            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            setLocation("/iniciarsesion");

        } catch (error) {
            console.error("Error en registro:", error);
            

            if (error.response) {
                setMensaje(error.response.data.message || "Error al registrar usuario");
            } else if (error.request) {
                setMensaje("Error de conexión con el servidor");
            } else {
                setMensaje("Error inesperado al preparar la solicitud");
            }
        }
    };

   
    const login = async (usuario) => {
        try {
            const body = {
                nombre_usuario: usuario.nombreUsuario.trim(),
                contrasena: usuario.contrasenaHash.trim(),
            };

            const resp = await axios.post(
                "http://localhost:3000/api/usuarios/login",
                body
            );

            const data = resp.data;

            if (data.status !== "ok") {
                setMensaje(data.message || "Credenciales incorrectas");
                return;
            }

            // Guardar sesión
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // Redirección según rol
            if (data.usuario.rol === "admin") {
                alert(`Bienvenido administrador ${data.usuario.nombre_usuario}`);
                setLocation("/admin/*");
            } else {
                setLocation("/inicio");
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);

            if (error.response) {
                setMensaje(error.response.data.message || "Credenciales incorrectas");
            } else if (error.request) {
                setMensaje("Error de conexión con el servidor");
            } else {
                setMensaje("Error inesperado al preparar la solicitud");
            }
        }
    };

    return (
        <div>
            {/* Pasa funciones y mensaje de error al formulario */}

            <Route path="/registro">
             <CrearCuenta registrar={registrar} mensaje={mensaje} />
            </Route>
            <Route path="/iniciarsesion">
            <IniciarSesion login={login} mensaje={mensaje} />
            </Route>
        </div>
    );
}
