import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import axios from "axios";
import TarjetaResena from "./TarjetaResena";
import FormularioComentario from "./FormularioComentario";
import ListadoComentarios from "./ListadoComentarios";
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta';

import { Route } from "wouter";

export default function DetalleResena() {
    const BACKEND_URL = "http://localhost:3000";
    // Obtener el token y el ID del usuario desde el localStorage
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const miId = usuario?.id;

    const [location, setLocation] = useLocation();

    // Obtener el ID de la reseña desde la URL
    const [match, params] = useRoute("/resenalibro/:id");
    //resenaId es el id que obtenemos de los parametros de la url
    const resenaId = params ? params.id : null;
    // Estados para la reseña y los comentarios
    const [resena, setResena] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    // Estados para carga y error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estado para mostrar el modal de no cuenta
    const [showModalCuenta, setShowModalCuenta] = useState(false);

    // Función para obtener la reseña
    const obtenerResena = async (id) => {
        try {
            // Realizar la solicitud al backend para obtener los detalles de la reseña
            const reviewRes = await axios.get(`${BACKEND_URL}/api/resenas/${id}`);
            // setear la reseña en el estado
            setResena(reviewRes.data);
        } catch (err) {
            console.error("Error al cargar reseña:", err);
            throw err;
        }
    };
    // Función para obtener los comentarios de la reseña
    const obtenerComentarios = async (id) => {
        try {
            // Realizar la solicitud al backend para obtener los comentarios de la reseña
            const commentsRes = await axios.get(`${BACKEND_URL}/api/comentarios/resena/${id}`);
            // setear los comentarios en el estado
            setComentarios(commentsRes.data.comentarios);
        } catch (err) {
            //Agregado manejo de error
            console.error("Error al cargar comentarios:", err);
            throw err;
        }
    };
    // Función para cargar la reseña y los comentarios
    const cargarDatos = async () => {
        // Verificar que el ID de la reseña esté disponible
        if (!resenaId) {
            setError("No se especificó un ID de reseña.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Cargar la reseña y los comentarios
            await obtenerResena(resenaId);
            await obtenerComentarios(resenaId);
        } catch (err) {
            //Agregado manejo de error
            setError(err.response?.data?.message || "Error al cargar la reseña y los comentarios");
        } finally {
            setLoading(false);
        }
    };
    // Función para guardar un nuevo comentario
    const guardarComentario = async (datos) => {
        // Verificar que el usuario esté autenticado
        if (!token) {
            // Mostrar el modal para iniciar sesión o crear cuenta
            setShowModalCuenta(true);
            return;
        }

        // Validar que el contenido del comentario no esté vacío
        if (datos.contenido.trim().length < 1) {
            alert("El comentario no puede estar vacío");
            return;
        }

        try {
            // Realizar la solicitud al backend para guardar el comentario
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


            // Recargar los comentarios después de guardar uno nuevo
            obtenerComentarios(resenaId);
        } catch (err) {
            console.error("Error al publicar comentario:", err);
            alert(err.response?.data?.message || "Error al enviar el comentario");
        }
    };

    const eliminarComentario = async (idComentario) => {
        // Verificar que el usuario esté autenticado
        if (!token) {
            // Mostrar el modal para iniciar sesión o crear cuenta
            setShowModalCuenta(true);
            return;
        }

        // Confirmar la eliminación del comentario
        if (!confirm("¿Eliminar este comentario?")) return;

        try {
            // Realizar la solicitud al backend para eliminar el comentario
            await axios.delete(`${BACKEND_URL}/api/comentarios/${idComentario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Recargar los comentarios después de eliminar uno
            obtenerComentarios(resenaId);
        } catch (err) {
            //Agregado manejo de error
            if (err.response?.status === 401) {
                alert("Tu sesión expiró. Inicia sesión nuevamente.");
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                setLocation("/iniciarsesion");
                return;
            }

            alert(err.response?.data?.message || "No se pudo eliminar el comentario.");
        }
    };

    useEffect(() => {
        // Cargar los datos cuando el componente se monta o cuando cambia el resenaId
        cargarDatos();
    }, [resenaId]);

    // Renderizar el componente según el estado de carga y error

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