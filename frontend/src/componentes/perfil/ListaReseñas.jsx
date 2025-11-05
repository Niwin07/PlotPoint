import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReseñaCard from "../home/ReseñaCard";
import ReseñaCardUs from "./ReseñaCardUs";
import portadaHP from "/src/img/libro.webp";

const ListaReseñas = () => {
  const [reviews, setReviews] = useState ([]);
   const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/resenas`, {
          headers: {
            'Authorization': `Bearer ${token}`
            
          }
        });
        console.log(response.data.resenas)

        const data = response.data.resenas;
        setReviews(data)
       
      } catch (err) {
        
        console.error(err);
      }
    };

    fetchUserReviews();
  }, []);

  //simulamos las reseñas de UN USUARIO (para ver tus reseñas o las de un usuario en particular) 
  const reseñas = [
    {
      titulo: "Harry Potter and the Deathly Hallows",
      urlPortada: "/src/img/libro.webp",
      contenido: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
      puntuacion: 2,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      urlPortada:"/src/img/libro.webp",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 3,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      urlPortada: "/src/img/libro.webp",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 4,
    },
    {
      titulo: "Harry Potter and the Deathly Hallows",
      urlPortada: "/src/img/libro.webp",
      contenido: "so heartbreaking i lowkey started to feel bad for watching sitting down",
      puntuacion: 5,
    },
  ];

  return (
    <div className="lista-reseñas">
      {/* se imprime el array de reseñas referente a UN USUARIO*/}
      {reviews.map((r, i) => (
        <ReseñaCardUs key={i} {...r} />
      ))}
    </div>
  );
};

export default ListaReseñas;
