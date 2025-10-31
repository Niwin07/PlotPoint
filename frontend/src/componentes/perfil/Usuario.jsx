import React from 'react';
import '/src/componentes/perfil/PerfilPag.css';

//importamos los componentes que utiliza el usuario

import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilPag from '/src/componentes/perfil/PerfilPag.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';

import { Route, Link, useRoute } from "wouter";

export default function Usuario() {

    
    // con esto hacemos que al seleccionar una seccion del usuario (ejemplo "reseñas") se active una clase del css que indique en el navegador del usuario
    //que nos movimos a esa seccion con un border abajo del nombre de la seccion
    const [matchPerfil] = useRoute("/usuario");
    const [matchReseñas] = useRoute("/usuario/reseñas");
    const [matchMeGustas] = useRoute("/usuario/megustas");

    return (
        <>
            <nav className="nav">

                 {/* activa la clase */}
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

            {/* renderiza el componente seleccionado en el navegador de perfil */}

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
