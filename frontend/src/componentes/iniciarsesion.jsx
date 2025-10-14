import React from 'react';
import '../css/iniciarsesion.css';


const iniciarsesion = () => {
    return (
        <div class="login" id="login">
            <div class="row">
                <form action="" class="formulario">
                    <div class="box">
                        <h3>Iniciar sesion</h3>
                        <div class="secciones">
                            <input type="text" placeholder="Nombre de usuario" class="input"></input>
                            <input type="password" placeholder="Contraseña" class="input"></input>
            
                        </div>
                        <input type="submit" value="Continuar" class="btn"></input>
                        <p>¿No tienes una cuenta? <span><a href="/registro">Crear cuenta</a></span></p>
                    </div>
                </form>
                <div class="imagen-form">
                    <img src="https://i.ibb.co/wZtxms8j/Agregar-un-t-tulo-20251011-032943-0000.png" alt=""></img>
                </div>
            </div>

        </div>
        
    );
};
export default iniciarsesion;