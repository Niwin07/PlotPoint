import React, { useState } from 'react';
import '/src/componentes/info/soporte.css';

const Soporte = () => {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjklgvaa";
    const [enviando, setEnviando] = useState(false);
    

    const manejarEnvio = (e) => {
        // Si ya se envió, prevenimos nuevos clicks
        if (enviando) {
            e.preventDefault();
            return;
        }
        // Cambiamos el estado a true para deshabilitar el botón
        setEnviando(true);
        
        // El formulario continuará su flujo normal hacia Formspree...
    };


    return (
        <div className="contacto" id="contacto">
            <div className="row">
                <form 
                    action={FORMSPREE_ENDPOINT} 
                    method="POST" 
                    className="formulario"
                    onSubmit={manejarEnvio} 
                >
                    <div className="box">
                        <h3>Soporte</h3>
                       
                        <input type="email" name="email" placeholder="Tu correo electrónico" required />
                        <textarea name="mensaje" placeholder="Escribe tus dudas..." required></textarea>
                        
                        <input 
                            type="submit" 
                            value={enviando ? "ENVIANDO..." : "ENVIAR"} 
                            className="btn"
                            disabled={enviando}
                            style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
                        />
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="/img/ilustracion.webp" alt=""></img>
                </div>
            </div>

        </div>
        
    );
};
export default Soporte;