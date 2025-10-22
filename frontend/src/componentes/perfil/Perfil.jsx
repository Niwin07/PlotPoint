/*
import React from 'react';
import '../css/PerfilPag.css';

import MeGustas from '/src/componentes/MeGustas';
import PerfilPag from '/src/componentes/PerfilPag';
import ListaReseñas from '/src/componentes/ListaReseñas';
import { Route, Link, useRoute } from "wouter";

export default function HeaderNavegacion() {
    return (
        <>
            <nav className="nav">
                <a href='/headernavegacion'>
                    <div className="nav-item nav-item-active">
                        Perfil
                    </div>
                </a>
                <a href='/headernavegacion/reseñas'>
                    <div className="nav-item">
                        Reseñas
                    </div>
                </a>
                <a href='/headernavegacion/megustas'>
                    <div className="nav-item">
                        Me gustas
                    </div>
                </a>
            </nav>

            <Route path="/headernavegacion">
                <PerfilPag />
            </Route>

            <Route path="/headernavegacion/reseñas">
                <ListaReseñas />
            </Route>

            <Route path="/headernavegacion/megustas">
               <MeGustas />
            </Route>
        </>
    );
}
*/

import React from 'react';
import '/src/componentes/perfil/PerfilPag.css';

//importamos los componentes que utiliza nuestro perfil

import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilPagUs from '/src/componentes/perfil/PerfilUsPag.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';
import EditarPerfil from '/src/componentes/perfil/EditarPerfil.jsx'
import { Route, Link, useRoute } from "wouter";

export default function HeaderNavegacion() {

    // con esto hacemos que al seleccionar una seccion del perfil (ejemplo "reseñas") se active una clase del css que indique en el navegador del usuario
    //que nos movimos a esa seccion con un border abajo del nombre de la seccion
    const [matchPerfil] = useRoute("/perfil");
    const [matchReseñas] = useRoute("/perfil/reseñas");
    const [matchMeGustas] = useRoute("/perfil/megustas");

    return (
        <>
            <nav className="nav">
                <Link href="/perfil/">
                
                    {/* activa la clase */}


                    <div className={`nav-item ${matchPerfil ? "nav-item-active" : ""}`}>
                        Perfil
                    </div>
                </Link>

                <Link href="/perfil/reseñas">
                    <div className={`nav-item ${matchReseñas ? "nav-item-active" : ""}`}>
                        Reseñas
                    </div>
                </Link>

                <Link href="/perfil/megustas">
                    <div className={`nav-item ${matchMeGustas ? "nav-item-active" : ""}`}>
                        Me gustas
                    </div>
                </Link>
            </nav>

            {/* renderiza el componente seleccionado en el navegador de perfil */}

            <Route path="/perfil">
                <PerfilPagUs />
            </Route>

            <Route path="/perfil/reseñas">
                <ListaReseñas />
            </Route>

            <Route path="/perfil/megustas">
                <MeGustas />
            </Route>

            <Route path="/perfil/editarperfil">
             <EditarPerfil />
            </Route>

            
        </>
    );
}
