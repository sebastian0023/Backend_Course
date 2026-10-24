import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getAll, getMine, getOne, create, update, remove } from "../controllers/item.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getAll);
router.get("/mine", getMine);
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
