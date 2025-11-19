import { useEffect, useState } from "react";
import { Route, useRoute } from "wouter";
import axios from "axios";
import DetalleLibro from "./DetalleLibro";
import ListadoResenas from "./ListadoResenas";
import ModalCalificar from "./ModalCalificar";
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta';




export default function Libro() {
    const BACKEND_URL = "http://localhost:3000";
    const [match, params] = useRoute("/libro/:id");
    const libroId = params ? params.id : null;
    const token = localStorage.getItem("token");

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
            const bookRes = await axios.get(`${BACKEND_URL}/api/libros/${id}`);
            setLibro(bookRes.data.book ?? bookRes.data);

            const avgRes = await axios.get(`${BACKEND_URL}/api/resenas/libro/${id}/promedio`);
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
            const reviewsRes = await axios.get(`${BACKEND_URL}/api/resenas?libro_id=${id}`);
            setResenas(reviewsRes.data.resenas);
        } catch (err) {
            console.warn("No se cargaron reseñas:", err.message);
        }
    };

    const verificarFavorito = async (id) => {
        if (!token) return;
        try {
            const favoriteRes = await axios.get(`${BACKEND_URL}/api/likes/check/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFavorite(favoriteRes.data.es_favorito);
        } catch (err) {
            console.error("Error al verificar favorito:", err);
        }
    };

    const toggleFavorite = async () => {
        if (!token) {
            setShowModalCuenta(true);

            return;
        }

        try {
            if (isFavorite) {
                await axios.delete(`${BACKEND_URL}/api/likes/${libroId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(false);
                alert(`Haz eliminado "${libro.titulo}" de tus favoritos`);
            } else {
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
        if (datos.puntuacion === 0 || datos.contenido.trim().length < 10) {
            alert("La puntuación es requerida y el contenido debe tener al menos 10 caracteres");
            return;
        }

        if (datos.contenido.trim().length > 1000) {
            alert("La reseña no puede exceder los 1000 caracteres");
            return;
        }

        try {
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

            obtenerResenas(libroId);
            obtenerLibro(libroId);
            setShowModal(false);
            alert("Reseña publicada exitosamente");
        } catch (err) {
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