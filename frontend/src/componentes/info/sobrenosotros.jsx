import React, { useEffect } from 'react';
import '/src/componentes/info/sobrenosotros.css';
//import '../js/sobrenosotros.js';

const SobreNosotros = () => {
    useEffect(() => {
        //este useEffect se encargara accionar una clase dependiedo de la pregunta que quieras conocer de nosotros y de ocultar las otras que no
        //seleccionaste
        const preguntas = document.querySelectorAll('.pregunta');
        preguntas.forEach(pregunta => {
            pregunta.addEventListener('click', function () {
                // Oculta todas las respuestas
                document.querySelectorAll('.respuesta').forEach(respuesta => {
                    respuesta.style.display = 'none';
                });

                // Muestra la respuesta correspondiente
                const respuesta = this.nextElementSibling;
                if (respuesta) {
                    respuesta.style.display = 'block';
                }
            });
        });

        // Limpieza de listeners al desmontar
        return () => {
            preguntas.forEach(pregunta => {
                pregunta.replaceWith(pregunta.cloneNode(true));
            });
        };
    }, []);



    return (
        <>
            <section class="faq" id="faq">

                <h1 class="cabeza">Sobre nosotros</h1>
                <div class="row">
                    <div class="imagen">
                        <img src="/src/img/sobrenosotros.webp" alt=""></img>
                    </div>
                    <div class="accordion-container">
                        <div class="box-preguntas">

                            {/* preguntas con sus respuestas ocultas hasta que tocas la pregunta */}
                            <h1 class="pregunta">
                                ¿Que es Plotpoint?
                            </h1>
                            <p class="respuesta">
                                PlotPoint es una red social de reseñas de libros al estilo de Letterboxd. Los usuarios pueden crear perfiles, seguirse entre ellos, marcar sus libros favoritos, escribir reseñas, calificar libros y comentar en las reseñas de otros usuarios.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Cual es nuestro objetivo?
                            </h1>
                            <p class="respuesta">
                                Es crear una aplicacion web donde los usuarios puedan compartir sus experiencias de lectura, descubrir nuevos libros y conectar con otros lectores en un entorno visualmente atractivo y facil de usar
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Tengo que pagar para usar Plotpoint?
                            </h1>
                            <p class="respuesta">
                               No, Plotpoint es completamente gratuita. Solo necesitas crear una cuenta para empezar a reseñar y conectar con otros lectores.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Que puedo hacer en mi perfil?
                            </h1>
                            <p class="respuesta">
                                En tu perfil podes ver tus libros favoritos y tus reseñas, editar tu informacion, y ver tus seguidores o personas a las que seguis. ¡Tu rincon personal dentro de la comunidad lectora!
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Puedo usar Plotpoint desde el celular?
                            </h1>
                            <p class="respuesta">
                               ¡Si! Plotpoint es una aplicacion web responsiva por lo que podes usarla tanto desde tu celular como desde tu comupadora sin perder calidad ni funcionalidad.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <h1 class="cabezadev"> <span>Desarrolladores</span></h1>
            <section class="reviews" id="reviews">

                <div class="reviews-slider">
                    {/* informacion de los desarrolladores (David y Nehuen) */}
                    <div class="base">
                        <div class="developer">
                            <div class="developer-info">
                                <img src="/src/img/perfil.webp" alt=""></img>
                                <h3>Aranda Cristian David</h3>
                                <p>Nacido en Ushuaia, Tierra del Fuego, David es un joven de 19 años que estudia en el Colegio Tecnico Provincial Olga B. de Arko, arranco a programar a partir de 4to año (2022) al escoger la especialidad de Programacion, desde ese entonces no paro y siguio aprendiendo los lenguajes que le requeria la educacion publica, siendo este su ultimo trabajo en la institucion.
                                </p>

                            </div>

                        </div>
                        <div class="developer">
                            <div class="developer-info">
                                <img src="/src/img/perfil.webp" alt=""></img>
                                <h3>Henry Nehuen Mesias Rios </h3>
                                <p>Nacido en Ushuaia, Tierra del Fuego, Nehuen es un joven de 19 años que estudia en el Colegio Tecnico Provincial Olga B. de Arko, arranco a programar a partir de 4to año (2022) al escoger la especialidad de Programacion, desde ese entonces no paro y siguio aprendiendo los lenguajes que le requeria la educacion publica, siendo este su ultimo trabajo en la institucion.
                                </p>

                            </div>

                        </div>
                    </div>
                </div>


            </section>

        </>







    );
};
export default SobreNosotros;