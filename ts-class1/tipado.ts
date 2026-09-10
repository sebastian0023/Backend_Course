import { IPersona } from "./interfaces";
import { Persona } from "./class";

const persona1: IPersona = {
    nombre: "Juan",
    edad: 20,
    activo: true,
    grupo: {
        aula: "A101",
        turno: "Matutino",
        carrera: "Ingeniería en Sistemas"
    },
    calificaciones: [85, 90, 78, 92]
}

const persona2: Persona = {
    nombre: "María",
    edad: 22,
    activo: false,
    grupo: {
        aula: "B202",
        turno: "Vespertino",
        carrera: "Licenciatura en Administración"
    },
    calificaciones: [88, 95, 80, 91]
};

const algo: number | boolean = 5;

const algo2: Array<number | boolean> = [5, true, 10, false];

const algo3: (number | boolean)[] = [5, true, 10, false];