import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUserById, deleteUserById } from '../controllers/userController.js';

const router = Router();
// GET 	/usuarios 	Obtener todos los usuarios
// GET 	/usuarios/:id 	Obtener un usuario por ID
// POST 	/usuarios 	Crear un nuevo usuario
// PUT 	/usuarios/:id 	Actualizar un usuario
// DELETE 	/usuarios/:id 	Eliminar un usuario

router.get('/usuarios', getUsers);
router.get('/usuarios/:id', getUserById);
router.post('/usuarios', createUser);
router.put('/usuarios/:id', updateUserById);
router.delete('/usuarios/:id', deleteUserById);

export default router;