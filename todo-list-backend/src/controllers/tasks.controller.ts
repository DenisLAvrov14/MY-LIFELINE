import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получение всех задач
export const getTasks = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).send(error.message);
  }
};

// Создание новой задачи
export const createTask = async (req: Request, res: Response) => {
  const { description, is_done } = req.body; 
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description, is_done) VALUES ($1, $2) RETURNING *",
      [description, is_done]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating task:", error.message);
    res.status(500).send(error.message);
  }
};

// Обновление задачи
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, is_done } = req.body;

  console.log(`Updating task with ID: ${id}`);
  console.log(`New description: ${description}`);
  console.log(`New is_done status: ${is_done}`);

  try {
    const result = await pool.query(
      "UPDATE tasks SET description = $1, is_done = $2 WHERE id = $3 RETURNING *",
      [description, is_done, id]
    );

    console.log(`Update result:`, result.rows[0]);

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    res.status(500).send(error.message);
  }
};

// Удаление задачи
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    res.status(500).send(error.message);
  }
};

// Отметить задачу как выполненную
export const markTaskAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE tasks SET is_done = true WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json({ message: "Task marked as done", task: result.rows[0] });
  } catch (error: any) {
    console.error("Error marking task as done:", error.message);
    res.status(500).send(`Error marking task as done: ${error.message}`);
  }
};
