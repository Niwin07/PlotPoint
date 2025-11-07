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
                                ¿Puedo usar PlotPoint desde el celular?
                            </h1>
                            <p class="respuesta">
                                ¡Si! PlotPoint es uan aplicacion web responsiva, por lo que podés usarla tanto desde tu celular como desde tu computadora sin perder calidad ni funcionalidad.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Qué tecnologías usan para PlotPoint?
                            </h1>
                            <p class="respuesta">
                                Nuestro stack es MERN, que incluye MySQL, Express, React y Node.js. Esto nos permite ofrecer una experiencia rápida, moderna y segura.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Qué diferencia a PlotPoint de otras apps como Goodreads?
                            </h1>
                            <p class="respuesta">
                                PlotPoint se centra en la experiencia social y visual: diseño moderno, navegacion simple y una comunidad activa de lectores que disfrutan compartir sus opiniones. No es una base de datos de libros, ¡es una red social para amantes de la lectura!
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                ¿Cómo manejan la seguridad del sistema?
                            </h1>
                            <p class="respuesta">
                                Implementamos autenticación segura, cifrado de contraseñas y validacion de datos. Además, el panel de administración está restringido solo a usuarios con rol de administrador.
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
                                <p>Oriundo de Ushuaia, Aranda Cristian David se encargo del desarrollo del frontend, componentes de React y diseño responsivo .                               </p>

                            </div>

                        </div>
                        <div class="developer">
                            <div class="developer-info">
                                <img src="/src/img/perfil.webp" alt=""></img>
                                <h3>Henry Nehuen Mesias Rios </h3>
                                <p>Oriunda de Ushuaia, Mesias Henry Nehuen se encargo del desarrollo del backend, APIs, base de datos y seguridad.
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