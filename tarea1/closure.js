function crearContador() {
    let total = 0;

    function incrementar() {
        total ++;
    }

    function disminuir() {
        total --;
    }

    function reset() {
        total = 0;
    }

    function obtenerTotal() {
        return total;
    }

    return {
        incrementar,
        disminuir,
        reset,
        obtenerTotal
    };
}

const contador = crearContador();
contador.incrementar();
contador.incrementar();
contador.incrementar();
contador.disminuir();
console.log(contador.obtenerTotal());
