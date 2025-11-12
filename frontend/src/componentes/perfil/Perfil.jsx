import React from 'react';
import '/src/componentes/perfil/PerfilPag.css';

//importamos los componentes que utiliza nuestro perfil

import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilPagUs from '/src/componentes/perfil/PerfilUsPag.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';
import EditarPerfil from '/src/componentes/perfil/EditarPerfil.jsx'
import { Route, Link, useRoute } from "wouter";

export default function HeaderNavegacion() {
    const [, paramsBase] = useRoute("/perfil/:id");
    const [, paramsMeGustas] = useRoute("/perfil/:id/megustas");
    const [, paramsResenas] = useRoute("/perfil/:id/reseñas");
    const miId = localStorage.getItem("usuario_id"); 

    const usuarioId = paramsBase?.id || paramsMeGustas?.id || paramsResenas?.id;


    // con esto hacemos que al seleccionar una seccion del perfil (ejemplo "reseñas") se active una clase del css que indique en el navegador del usuario
    //que nos movimos a esa seccion con un border abajo del nombre de la seccion
    const [matchPerfil] = useRoute("/perfil/:id");
    const [matchReseñas] = useRoute("/perfil/:id/reseñas");
    const [matchMeGustas] = useRoute("/perfil/:id/megustas");

    return (
        <>
            <nav className="nav">
                <Link href={`/perfil/${usuarioId}`}>

                    {/* activa la clase */}


                    <div className={`nav-item ${matchPerfil ? "nav-item-active" : ""}`}>
                        Perfil
                    </div>
                </Link>

                <Link href={`/perfil/${usuarioId}/reseñas`}>
                    <div className={`nav-item ${matchReseñas ? "nav-item-active" : ""}`}>
                        Reseñas
                    </div>
                </Link>

                <Link href={`/perfil/${usuarioId}/megustas`}>
                    <div className={`nav-item ${matchMeGustas ? "nav-item-active" : ""}`}>
                        Me gustas
                    </div>
                </Link>
            </nav>

            {/* renderiza el componente seleccionado en el navegador de perfil */}

            <Route path="/perfil/:id">
                <PerfilPagUs />
            </Route>
            <Route path="/perfil/:id/editarperfil">
                <EditarPerfil />
            </Route>


            <Route path="/perfil/:id/reseñas">
                <ListaReseñas 
                usuarioId={usuarioId}
                />
            </Route>

            <Route path="/perfil/:id/megustas">
                <MeGustas
                usuarioId={usuarioId}
                />
            </Route>

            

        </>
    );
}
