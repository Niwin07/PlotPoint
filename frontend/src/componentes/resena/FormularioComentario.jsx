import { useState } from "react";

export default function FormularioComentario({ guardarComentario }) {
    const [contenido, setContenido] = useState("");

    const guardar = (e) => {
        e.preventDefault();
        const comentario = {
            contenido
        };
        guardarComentario(comentario);
        setContenido("");
    };

    return (
        <div className="input-section">
            <input
                type="text"
                className="input"
                placeholder="Escribe un comentario..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
            />
            <button className="send-button" onClick={guardar}>
                Enviar
            </button>
        </div>
    );
}