import React, { useEffect } from 'react';
import '../css/sobrenosotros.css';
//import '../js/sobrenosotros.js';

const SobreNosotros = () => {
    useEffect(() => {
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
                            <h1 class="pregunta">
                                ¿Que es Plotpoint?
                            </h1>
                            <p class="respuesta">
                                PlotPoint es una red social de reseñas de libros al estilo de Letterboxd. Los usuarios pueden crear perfiles, seguirse entre ellos, marcar sus libros favoritos, escribir reseñas, calificar libros y comentar en las reseñas de otros usuarios.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                Pregunta #2
                            </h1>
                            <p class="respuesta">
                                Nuestra mayor meta es tener su confianza al momento de cualquier compra, cada centavo vale la pena.
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                Pregunta #3
                            </h1>
                            <p class="respuesta">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium minus totam sunt iure ducimus beatae voluptas error est maxime laboriosam?
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                Pregunta #4
                            </h1>
                            <p class="respuesta">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium minus totam sunt iure ducimus beatae voluptas error est maxime laboriosam?
                            </p>
                        </div>
                        <div class="box-preguntas">
                            <h1 class="pregunta">
                                Pregunta #5
                            </h1>
                            <p class="respuesta">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium minus totam sunt iure ducimus beatae voluptas error est maxime laboriosam?
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <h1 class="cabezadev"> <span>Desarrolladores</span></h1>
            <section class="reviews" id="reviews">

                <div class="reviews-slider">
                    <div class="base">
                        <div class="developer">
                            <div class="developer-info">
                                <img src="/src/img/perfil.webp" alt=""></img>
                                <h3>Aranda Cristian David</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, perspiciatis eaque nisi placeat a nam assumenda tempore adipisci dolore molestiae?
                                </p>

                            </div>

                        </div>
                        <div class="developer">
                            <div class="developer-info">
                                <img src="/src/img/perfil.webp" alt=""></img>
                                <h3>Henry Nehuen Mesias Rios </h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, perspiciatis eaque nisi placeat a nam assumenda tempore adipisci dolore molestiae?
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