type Turno = "Matutino" | "Vespertino" | "Nocturno";

export interface IGrupo {
    aula: string;
    turno: Turno;
    carrera: string;
}

export interface IPersona {
    nombre: string;
    edad: number;
    activo: boolean;
    grupo: IGrupo;
    calificaciones: number[];
}

