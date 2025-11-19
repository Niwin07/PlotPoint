import { useState, useMemo } from "react";

export default function usePaginacion(items = [], itemsPorPagina = 10) {
    const [paginaActual, setPaginaActual] = useState(0);

    const totalPaginas = Math.ceil(items.length / itemsPorPagina);

    const paginaItems = useMemo(() => {
        const inicio = paginaActual * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        return items.slice(inicio, fin);
    }, [items, paginaActual, itemsPorPagina]);

    const siguientePagina = () => {
        if (paginaActual < totalPaginas - 1) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaActual > 0) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const irAlaPagina = (n) => {
        if (n >= 0 && n < totalPaginas) {
            setPaginaActual(n);
        }
    };

    return {
        paginaActual,
        totalPaginas,
        paginaItems,
        siguientePagina,
        paginaAnterior,
        irAlaPagina,
        setPaginaActual
    };
}
