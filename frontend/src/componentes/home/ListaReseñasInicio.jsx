import React, { useState, useEffect } from "react";
import ReseñaCard from "./ReseñaCard";
import ReseñaCardUs from "../perfil/ReseñaCardUs";
import axios from 'axios';


const ListaReseñasInicio = () => {

  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchFeedReviews = async () => {
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

    fetchFeedReviews();
  }, []);

 

  return (
    <div className="lista-reseñas">

      {/* se imprimen las reseñas al array */}
      {reviews.map((r, i) => (
        <ReseñaCard key={i} {...r} />
      ))}
    </div>
  );
};

export default ListaReseñasInicio;
