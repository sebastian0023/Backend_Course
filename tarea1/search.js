const users = [
    {
        id: 1,
        name: "Daniel",
        email: "daniel@gmail.com"
    },
    {
        id: 2,
        name: "Sebastian",
        email: "sebastian@gmail.com"
    },
    {
        id: 3,
        name: "Cristiano",
        email: "cristiano@gmail.com"
    },
    {
        id: 4,
        name: "Ronaldo",
        email: "ronaldo@gmail.com"
    }
];

function buscarConFor(users, email) {

    for (let i = 0; i < users.length; i++) {

        if (users[i].email === email) {
            return users[i];
        }
    }

    return undefined;
}

function buscarConFind(users, email) {

    return users.find(user => user.email === email);
}

function crearIndice(users) {

    const indice = {};

    for (let i = 0; i < users.length; i++) {

        const user = users[i];

        indice[user.email] = user;
    }

    return indice;
}

console.log(buscarConFor(users, "daniel@gmail.com"));
console.log(buscarConFind(users, "sebastian@gmail.com"));
console.log(crearIndice(users)["cristiano@gmail.com"]);

const opinion = "En conclusion son muy similares el fir y el find, solo que el ciclo for te deja controlar el ciclo a diferencia del find, por otro lado al buscar por un indice es lo mas rapido porque sabes justo donde esta, aunque claro primero debes crear los indices, pero si lo planeas bien seria la mejor opcion para buscar como por ejemplo en una base de datos."

console.log(opinion);