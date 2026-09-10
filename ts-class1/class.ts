interface IPersona {
    nombre: string;
    getNombre: () => string;
    setNombre: (nombre: string) => void;
}

export class Persona implements IPersona {
    nombre: string = "";

    


    getNombre(): string {
        return this.nombre;
    }
    setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    

}