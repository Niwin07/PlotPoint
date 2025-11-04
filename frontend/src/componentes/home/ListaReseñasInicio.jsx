import React from "react";
import ReseñaCard from "./ReseñaCard";
import ReseñaCardUs from "../perfil/ReseñaCardUs";


const ListaReseñasInicio = () => {

  //simula un array de reseñas de VARIOS USUARIOS  (unicamente para la seccion de "reseñas" del inicio) 
  const reseñas = [
    {
      id: 1,
      titulo: "Harry Potter and the Deathly Hallows",
      nombreUsuario: "Maria_Jose_Rodriguez2006",
      urlPortada: "/src/img/libro.webp",
      contenido: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
      puntuacion: 2.5,
      urlAvatar: "/src/img/perfil.webp"
    },
    {
      id: 2,
      titulo: "Harry Potter and the Deathly Hallows",
      nombreUsuario: "Beck",
      urlPortada: "https://books.google.com/books/content?id=mnf9mixwzBAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 1,
      urlAvatar: "/src/img/perfil.webp"
    },
    {
      id: 3,
      titulo: "Harry Potter and the Deathly Hallows",
      nombreUsuario: "Beck",
      urlPortada: "/src/img/libro.webp",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 5,
      urlAvatar: "/src/img/perfil.webp"

    },
    {
      id: 4,
      titulo: "Harry Potter and the Deathly Hallows",
      nombreUsuario: "Beck",
      urlPortada: "/src/img/libro.webp",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 3,
      urlAvatar: "/src/img/perfil.webp"
    },
  ];

  return (
    <div className="lista-reseñas">

      {/* se imprimen las reseñas al array */}
      {reseñas.map((r, i) => (
        <ReseñaCard key={i} {...r} />
      ))}
    </div>
  );
};

export default ListaReseñasInicio;
