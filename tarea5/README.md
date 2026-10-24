# Tarea 5 – API de torneo de eliminación sencilla

Node.js + Express 5 + TypeScript + Mongoose (MongoDB). Estructura MVC.

## Uso

```bash
cd tarea5
npm install
cp .env.example .env   # ajusta URL (cadena de conexión de MongoDB)
npm run dev            # desarrollo (nodemon + ts-node)
npm run build && npm start
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/tournaments` | Crea torneo `{ name, registrationDeadline, eventDate }` (fechas `YYYY-MM-DD`) |
| GET | `/api/tournaments` · `/api/tournaments/:tournamentId` | Lista / consulta torneos |
| POST | `/api/tournaments/:tournamentId/participants` | Registra `{ name, score }` |
| GET | `/api/tournaments/:tournamentId/participants` | Lista participantes (por ranking) |
| POST | `/api/tournaments/:tournamentId/bracket` | Genera la llave (reemplaza la anterior si existe) |
| GET | `/api/tournaments/:tournamentId/bracket` | Consulta la llave |

## Reglas

- Mayor `score` = mejor ranking; en empate queda mejor quien se registró primero.
- La llave se completa a la siguiente potencia de 2 con **Bye**; los mejores rankings reciben los Bye y avanzan automáticamente.
- Siembra estándar (1v8, 4v5, 2v7, 3v6): los emparejamientos son mejor vs peor y los dos mejores solo se cruzan en la final.
- Las rondas siguientes se crean con `TBD` donde aún no hay ganador (los que pasaron por Bye ya aparecen).
- El registro cierra al terminar el día de `registrationDeadline` (UTC). `score` debe ser número finito ≥ 0.
- Se necesitan al menos 2 participantes para generar la llave.

## Códigos de respuesta

`201` creado · `400` datos inválidos / id mal formado / registro cerrado / pocos participantes · `404` torneo, llave o ruta inexistente · `500` error interno.

## Estructura

```
src/
├── controllers/   tourney, participant, bracket
├── middleware/    tourneyMiddleware.ts: validaciones, carga de torneo (404) y manejo de errores
├── models/        Tourney, Participant, Bracket
├── routes/
├── services/      bracketService.ts (siembra, Bye y rondas)
├── app.ts
└── server.ts
```
