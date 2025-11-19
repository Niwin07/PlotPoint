import { useEffect, useState } from "react";
import { Route, useRoute } from "wouter";
import axios from "axios";
import DetalleLibro from "./DetalleLibro";
import ListadoResenas from "./ListadoResenas";
import ModalCalificar from "./ModalCalificar";
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta';




export default function Libro() {
    const BACKEND_URL = "http://localhost:3000";
    // Obtener el ID del libro desde la URL
    const [match, params] = useRoute("/libro/:id");
    //libroId es el id que obtenemos de los parametros de la url
    const libroId = params ? params.id : null;
    // Obtener el token del localStorage para autenticación
    const token = localStorage.getItem("token");
    
    // Estados para el libro, reseñas, carga, error, favorito y modales

    const [libro, setLibro] = useState(null);
    const [resenas, setResenas] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isFavorite, setIsFavorite] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showModalCuenta, setShowModalCuenta] = useState(false);



    const obtenerLibro = async (id) => {
        setLoading(true);
        setError(null);
        try {
            // Realizar la solicitud al backend para obtener los detalles del libro
            const bookRes = await axios.get(`${BACKEND_URL}/api/libros/${id}`);
            // Manejar ambos formatos de respuesta posibles
            setLibro(bookRes.data.book ?? bookRes.data);

            // Obtener el promedio de calificaciones por separado
            const avgRes = await axios.get(`${BACKEND_URL}/api/resenas/libro/${id}/promedio`);
            //Incluir el promedio en el estado del libro
            if (avgRes.data.promedio) {
                setLibro(prev => ({
                    ...prev,
                    promedio: avgRes.data.promedio
                }));
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al cargar libro");
        } finally {
            setLoading(false);
        }
    };

    const obtenerResenas = async (id) => {
        try {
            // Realizar la solicitud al backend para obtener las reseñas del libro
            const reviewsRes = await axios.get(`${BACKEND_URL}/api/resenas?libro_id=${id}`);
            setResenas(reviewsRes.data.resenas);
        } catch (err) {
            console.error("No se cargaron reseñas:", err.message);
        }
    };

    const verificarFavorito = async (id) => {
        // Si no hay token, no es favorito
        if (!token) return;
        
        try {
            // Verificar si el libro es favorito del usuario
            const favoriteRes = await axios.get(`${BACKEND_URL}/api/likes/check/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Actualizar el estado de favorito (true)
            setIsFavorite(favoriteRes.data.es_favorito);
        } catch (err) {
            console.error("Error al verificar favorito:", err);
        }
    };

    const toggleFavorite = async () => {
        // Si no hay token, mostrar modal de que debes iniciar sesion o registrarte
        if (!token) {
            setShowModalCuenta(true);
            return;
        }

        try {
            // Agregar o quitar de favoritos según el estado actual (true o false)
            if (isFavorite) {
                // Quitar de favoritos
                await axios.delete(`${BACKEND_URL}/api/likes/${libroId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(false);
                alert(`Haz eliminado "${libro.titulo}" de tus favoritos`);
            } else {
                // Agregar a favoritos
                await axios.post(
                    `${BACKEND_URL}/api/likes`,
                    { libro_id: parseInt(libroId) },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setIsFavorite(true);
                alert(`Haz agregado "${libro.titulo}" a tus favoritos`);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error al actualizar favoritos");
        }
    };

    const guardarResena = async (datos) => {
        // Validaciones básicas
        if (datos.puntuacion === 0 || datos.contenido.trim().length < 10) {
            alert("La puntuación es requerida y el contenido debe tener al menos 10 caracteres");
            return;
        }

        if (datos.contenido.trim().length > 1000) {
            alert("La reseña no puede exceder los 1000 caracteres");
            return;
        }

        try {
            // Enviar la reseña al backend
            await axios.post(
                `${BACKEND_URL}/api/resenas`,
                {
                    libro_id: parseInt(libroId),
                    puntuacion: datos.puntuacion,
                    contenido: datos.contenido.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Refrescar las reseñas y el detalle del libro
            obtenerResenas(libroId);
            obtenerLibro(libroId);

            // Cerrar el modal y mostrar mensaje de éxito
            setShowModal(false);
            alert("Reseña publicada exitosamente");
        } catch (err) {
            //Manejar errores específicos
            console.error("Error:", err);
            if (err.response?.status === 401) {
                alert("Debes iniciar sesión para publicar una reseña");
            } else if (err.response?.status === 409) {
                alert("Ya has reseñado este libro");
            } else if (err.response?.status === 400) {
                alert(err.response.data.message || "Error en los datos de la reseña");
            } else {
                alert("Error al publicar la reseña");
            }
        }
    };

    useEffect(() => {
        // Si tenemos un ID de libro, obtener sus datos y reseñas
        if (libroId) {
            obtenerLibro(libroId);
            obtenerResenas(libroId);
            
            verificarFavorito(libroId);
        } else {
            setError("No se especificó un ID de libro en la URL.");
        }
    }, [libroId]);

    return (
        <Route path="/libro/:id">
        <div className="book-container">
            {loading && <div>Cargando...</div>}
            {error && <div style={{ color: "red" }}>Error: {error}</div>}

            {libro && (
                <>
                    <DetalleLibro
                        libro={libro}
                        isFavorite={isFavorite}
                        toggleFavorite={toggleFavorite}
                        abrirModal={() => {
                            // Validar si hay token antes de abrir el modal de calificar
                            if (token) {
                                setShowModal(true);
                            } else {
                                setShowModalCuenta(true);
                            }
                        }}
                        backendUrl={BACKEND_URL}
                    />

                    <ListadoResenas
                        resenas={resenas}
                        backendUrl={BACKEND_URL}
                    />
                </>
            )}

            {showModal && (
                <ModalCalificar
                    cerrarModal={() => setShowModal(false)}
                    guardarResena={(datos) => guardarResena(datos)}
                />
            )}

            {showModalCuenta && (
                <ModalNoCuenta onClose={() => setShowModalCuenta(false)} />
            )}

           
        
        
        
        </div>
        </Route>
    );
}