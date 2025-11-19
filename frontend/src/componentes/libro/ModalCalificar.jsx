import { useState } from "react";
import Rating from "react-rating";


export default function ModalCalificar({ cerrarModal, guardarResena }) {
    const [puntuacion, setPuntuacion] = useState(0);
    const [contenido, setContenido] = useState("");
    const [pendiente, setPendiente] = useState(false);

   
    const token = localStorage.getItem("token");

    const guardar = async (e) => {
        e.preventDefault();
        console.log(token)

      
        
        setPendiente(true);
        
        const resena = {
            puntuacion,
            contenido
        };
        
        await guardarResena(resena);
        setPendiente(false);
        setPuntuacion(0);
        setContenido("");
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={cerrarModal} className="cancel-btn">
                    VOLVER
                </button>
                <h2>Calificar libro</h2>
                <Rating
                    initialRating={puntuacion}
                    onChange={(valor) => setPuntuacion(valor)}
                    fractions={2}
                    emptySymbol={<span className="star empty big">☆</span>}
                    fullSymbol={<span className="star full big">★</span>}
                />
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Explica tu reseña..."
                />
                <div className="modal-buttons">
                    <button
                        onClick={guardar}
                        disabled={pendiente}
                        className="save-btn"
                    >
                        {pendiente ? "Enviando..." : "Calificar"}
                    </button>
                </div>
            </div>
           
        </div>
    );
}