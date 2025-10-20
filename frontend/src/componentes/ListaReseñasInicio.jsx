import React from "react";
import ReseñaCard from "./ReseñaCard";
import ReseñaCardUs from "./ReseñaCardUs";
import portadaHP from "/src/img/libro.webp"; 

const ListaReseñasInicio = () => {

  //simula un array de reseñas de VARIOS USUARIOS  (unicamente para la seccion de "reseñas" del inicio) 
  const reseñas = [
    {
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "Maria_Jose_Rodriguez2006",
      portada: portadaHP,
      texto: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
      color: "blue",
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "Beck",
      portada: portadaHP,
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      color: "magenta",
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "Beck",
      portada: portadaHP,
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      color: "limegreen",
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "Beck",
      portada: portadaHP,
      texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      color: "goldenrod",
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
