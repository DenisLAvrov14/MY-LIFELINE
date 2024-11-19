import { Router, Request, Response } from 'express';
import { connection } from '../services/db.connection';
import { ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  username: string;
  email: string;
}

const router = Router();

const createUser = async (req: Request, res: Response): Promise<void> => {
  const newUser: User = req.body;
  const query = "INSERT INTO users SET ?";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, newUser);
    res.status(201).json({ id: result.insertId, ...newUser });
  } catch (err) {
    console.error("Error creating user: ", err);
    res.status(500).send('Error creating user');
  }
};

router.post("/users", createUser);

export default router;
