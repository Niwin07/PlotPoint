import React from 'react';
import '/src/componentes/info/soporte.css';

const Soporte = () => {
    //Endpoint para recibir los correos, Formspree
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjklgvaa";

    return (
        <div className="contacto" id="contacto">
            <div className="row">
                <form action={FORMSPREE_ENDPOINT} method="POST" className="formulario">
                    <div className="box">
                        <h3>Soporte</h3>
                       
                        <input type="email" name="email" placeholder="Tu correo electrónico" required />

                        <textarea name="mensaje" placeholder="Escribe tus dudas..." required></textarea>
                        
                        <input type="submit" value="ENVIAR" className="btn"></input>
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="/src/img/ilustracion.webp" alt=""></img>
                </div>
            </div>

        </div>
        
    );
};
export default Soporte;