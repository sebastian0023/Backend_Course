import express, { Request, Response, NextFunction } from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import itemsRoutes from "./routes/items.routes";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

app.get("/", (_req, res) => res.redirect("/login.html"));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "JSON inválido" });
    }
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
});

export default app;