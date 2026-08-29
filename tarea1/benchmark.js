function generarDatos(cantidad) {

    const datos = [];

    for (let i = 0; i < cantidad; i++) {
        datos.push({
            id: i,
            activo: i % 2 === 0
        });
    }

    return datos;
}

function filterMap(datos) {

    return datos
        .filter(dato => dato.activo)
        .map(dato => dato.id);
}

function reduceMethod(datos) {

    return datos.reduce((resultado, dato) => {

        if (dato.activo) {
            resultado.push(dato.id);
        }

        return resultado;

    }, []);
}

function forMethod(datos) {

    const resultado = [];

    for (let i = 0; i < datos.length; i++) {

        if (datos[i].activo) {
            resultado.push(datos[i].id);
        }
    }

    return resultado;
}

function benchmark(nombre, funcion, datos) {

    const inicio = performance.now();

    funcion(datos);

    const final = performance.now();

    const tiempo = final - inicio;

    console.log(`${nombre}: ${tiempo.toFixed(4)} ms`);
}

const datos = generarDatos(100000);

benchmark("filter + map", filterMap, datos);
benchmark("reduce", reduceMethod, datos);
benchmark("for", forMethod, datos);

const volumenes = [
    1000,
    10000,
    100000,
    1000000
];

for (let i = 0; i < volumenes.length; i++) {

    const cantidad = volumenes[i];

    console.log(`\n${cantidad} elementos`);

    const datos = generarDatos(cantidad);

    benchmark("filter + map", filterMap, datos);
    benchmark("reduce", reduceMethod, datos);
    benchmark("for", forMethod, datos);
}
