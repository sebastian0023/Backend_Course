import {
    info,
    warn,
    error,
    configure
} from "./logger.js";


configure({
    level: "all",
    output: "file"
});


info("Iniciando la aplicacion");
warn("La base de datos esta lenta");
error("No se pudo conectar a la base de datos");

