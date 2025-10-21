import React from "react";
import ReseñaCard from "./ReseñaCard";
import ReseñaCardUs from "./ReseñaCardUs";
import portadaHP from "/src/img/libro.webp"; 

const ListaReseñas = () => {

  //simulamos las reseñas de UN USUARIO (para ver tus reseñas o las de un usuario en particular) 
  const reseñas = [
    {
      titulo: "Harry Potter and the Deathly Hallows",
      portada: "/src/img/libro.webp",
      texto: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
      rating: 2,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      portada:"/src/img/libro.webp",
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      rating: 3,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      portada: "/src/img/libro.webp",
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      rating: 4,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      portada: "/src/img/libro.webp",
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      rating: 5,
    },
  ];

  return (
    <div className="lista-reseñas">
      {/* se imprime el array de reseñas referente a UN USUARIO*/}
      {reseñas.map((r, i) => (
        <ReseñaCardUs key={i} {...r} />
      ))}
    </div>
  );
};

export default ListaReseñas;
