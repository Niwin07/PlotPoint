import React from 'react';
import '../css/soporte.css';

// este componente se encargara de que si, tienes cualquier duda sobre plotpoint, lo consultes enviandonos un mensaje que nos llegara al correo
//para que posteriormente nosotros aclaremos o solucionemos tus dudas.


const Soporte = () => {
    return (
        <div class="contacto" id="contacto">
            <div class="row">
                <form action="" class="formulario">
                    <div class="box">
                        <h3>Soporte</h3>
                       
                        <textarea name="" placeholder="Escribe tus dudas..."></textarea>
                        <input type="submit" value="ENVIAR" class="btn"></input>
                    </div>
                </form>
                <div class="imagen-form">
                    <img src="/src/img/ilustracion.webp" alt=""></img>
                </div>
            </div>

        </div>
        
    );
};
export default Soporte;