import { useState, useMemo } from "react";

// recibe la lista de items y cuántos quiere que se vean por pagina 
export default function usePaginacion(items = [], itemsPorPagina = 10) {
    
    // estado para saber dónde estamos parados (empieza en 0 = página 1)
    const [paginaActual, setPaginaActual] = useState(0);

    // calcula cuántas páginas hay en total (ej: 105 items / 10 = 10.5 -> Redondea a 11 páginas, googlear "Math.ceil")
    const totalPaginas = Math.ceil(items.length / itemsPorPagina);

    // recorta el array original para mostrar SOLO los items de la página actual.
    // 'useMemo' guarda este resultado en memoria y solo recalcula si cambian los items o la página (si son editados).
    const paginaItems = useMemo(() => {
        const inicio = paginaActual * itemsPorPagina; // ej: Pag 2 * 10 = indice 20
        const fin = inicio + itemsPorPagina;          // ej: 20 + 10 = indice 30
        return items.slice(inicio, fin);              // corta del 20 al 30
    }, [items, paginaActual, itemsPorPagina]);

    // funciones de control
    
    const siguientePagina = () => {
        // solo avanza si no estamos en la última página
        if (paginaActual < totalPaginas - 1) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const paginaAnterior = () => {
        // retrocede si no estamos en la primera página (0)
        if (paginaActual > 0) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const irAlaPagina = (n) => {
        // valida que la página 'n' exista antes de saltar
        if (n >= 0 && n < totalPaginas) {
            setPaginaActual(n);
        }
    };

    // devuelve todo lo que el componente visual necesita
    return {
        paginaActual,
        totalPaginas,
        paginaItems,      // los items recortados para mostrar en el momento
        siguientePagina,  // función para botón "siguiente >"
        paginaAnterior,   // función para botón "< anterior"
        irAlaPagina,      // función para ir a pag X
        setPaginaActual
    };
}