import { Request, Response } from "express";
import { connection } from "../services/db.connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM tasks");
    res.json(rows);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { description, is_done } = req.body; 
  try {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO tasks (description, is_done) VALUES (?, ?)", 
      [description, is_done]
    );
    res.status(201).json({ id: result.insertId, description, is_done });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, is_done } = req.body;

  console.log(`Updating task with ID: ${id}`);
  console.log(`New description: ${description}`);
  console.log(`New is_done status: ${is_done}`);

  try {
    const [result] = await connection.query("UPDATE tasks SET description = ?, is_done = ? WHERE id = ?", [description, is_done, id]);

    console.log(`Update result: `, result);

    res.sendStatus(204);
  } catch (error: any) {
    console.error('Error updating task:', error.message);
    res.status(500).send(error.message);
  }
};


export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connection.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Новая функция markTaskAsDone
export const markTaskAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connection.query<ResultSetHeader>("UPDATE tasks SET is_done = ? WHERE id = ?", [true, id]);
    res.status(200).json({ message: 'Task marked as done' });
  } catch (error: any) {
    res.status(500).send(`Error marking task as done: ${error.message}`);
  }
};
