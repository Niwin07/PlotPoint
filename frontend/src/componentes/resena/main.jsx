import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import axios from "axios";
import TarjetaResena from "./TarjetaResena";
import FormularioComentario from "./FormularioComentario";
import ListadoComentarios from "./ListadoComentarios";
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta';

import { Route } from "wouter";

export default function DetalleResena() {
    const BACKEND_URL = "http://localhost:3000";
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const miId = usuario?.id;

    const [match, params] = useRoute("/resenalibro/:id");
    const resenaId = params ? params.id : null;

    const [resena, setResena] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModalCuenta, setShowModalCuenta] = useState(false);

    const obtenerResena = async (id) => {
        try {
            const reviewRes = await axios.get(`${BACKEND_URL}/api/resenas/${id}`);
            setResena(reviewRes.data);
        } catch (err) {
            console.error("Error al cargar reseña:", err);
            throw err;
        }
    };

    const obtenerComentarios = async (id) => {
        try {
            const commentsRes = await axios.get(`${BACKEND_URL}/api/comentarios/resena/${id}`);
            setComentarios(commentsRes.data.comentarios);
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
            throw err;
        }
    };

    const cargarDatos = async () => {
        if (!resenaId) {
            setError("No se especificó un ID de reseña.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await obtenerResena(resenaId);
            await obtenerComentarios(resenaId);
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar la reseña y los comentarios");
        } finally {
            setLoading(false);
        }
    };

    const guardarComentario = async (datos) => {
        if (!token) {
            setShowModalCuenta(true);
            return;
        }

        if (datos.contenido.trim().length < 1) {
            alert("El comentario no puede estar vacío");
            return;
        }

        try {
            await axios.post(
                `${BACKEND_URL}/api/comentarios`,
                {
                    resena_id: parseInt(resenaId),
                    contenido: datos.contenido.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            obtenerComentarios(resenaId);
        } catch (err) {
            console.error("Error al publicar comentario:", err);
            alert(err.response?.data?.message || "Error al enviar el comentario");
        }
    };

    const eliminarComentario = async (idComentario) => {
        if (!token) {
            setShowModalCuenta(true);
            return;
        }

        if (!confirm("¿Eliminar este comentario?")) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/comentarios/${idComentario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            obtenerComentarios(resenaId);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Tu sesión expiró. Inicia sesión nuevamente.");
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                window.location.href = "/iniciarsesion";
                return;
            }

            alert(err.response?.data?.message || "No se pudo eliminar el comentario.");
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [resenaId]);

    if (loading) {
        return <div className="container">Cargando...</div>;
    }

    if (error) {
        return <div className="container" style={{ color: "red" }}>Error: {error}</div>;
    }

    if (!resena) {
        return <div className="container">Reseña no encontrada.</div>;
    }

    return (
        <Route path="/resenalibro/:id">
        <div className="container">
            <TarjetaResena
                resena={resena}
                backendUrl={BACKEND_URL}
            />

            <FormularioComentario
                guardarComentario={(datos) => guardarComentario(datos)}
            />

            <ListadoComentarios
                comentarios={comentarios}
                miId={miId}
                backendUrl={BACKEND_URL}
                eliminarComentario={(id) => eliminarComentario(id)}
            />
        </div>
            {showModalCuenta && <ModalNoCuenta onClose={() => setShowModalCuenta(false)} />}
        </Route>
    );
}