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
import '../css/PerfilPag.css';

import MeGustas from '/src/componentes/MeGustas';
import PerfilPag from '/src/componentes/PerfilPag';
import ListaReseñas from '/src/componentes/ListaReseñas';

import { Route, Link, useRoute } from "wouter";

export default function Usuario() {
    const [matchPerfil] = useRoute("/usuario");
    const [matchReseñas] = useRoute("/usuario/reseñas");
    const [matchMeGustas] = useRoute("/usuario/megustas");

    return (
        <>
            <nav className="nav">
                <Link href="/usuario/">
                    <div className={`nav-item ${matchPerfil ? "nav-item-active" : ""}`}>
                        Perfil
                    </div>
                </Link>

                <Link href="/usuario/reseñas">
                    <div className={`nav-item ${matchReseñas ? "nav-item-active" : ""}`}>
                        Reseñas
                    </div>
                </Link>

                <Link href="/usuario/megustas">
                    <div className={`nav-item ${matchMeGustas ? "nav-item-active" : ""}`}>
                        Me gustas
                    </div>
                </Link>
            </nav>

            <Route path="/usuario">
                <PerfilPag />
            </Route>

            <Route path="/usuario/reseñas">
                <ListaReseñas />
            </Route>

            <Route path="/usuario/megustas">
                <MeGustas />
            </Route>


            
        </>
    );
}
