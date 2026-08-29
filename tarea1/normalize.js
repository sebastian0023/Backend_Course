const users = [
  { id: 1, name: "Ana", roles: ["admin", "editor"] },
  { id: 2, name: "Luis", roles: ["editor"] },
  { id: 1, name: "Ana", roles: ["viewer"] }
];

function normalizeUsers(users) {
    const res = {};

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (!res[user.id]){
            res[user.id] = {
                id: user.id,
                name: user.name,
                roles: []
            };
        }

        for (let j = 0; j < user.roles.length; j++) {
            const role = user.roles[j];
            if (!res[user.id].roles.includes(role)) {
                res[user.id].roles.push(role);
            }
        }
    }
    return res; 

}

const normalizedUsers = normalizeUsers(users);
console.log(normalizedUsers);

