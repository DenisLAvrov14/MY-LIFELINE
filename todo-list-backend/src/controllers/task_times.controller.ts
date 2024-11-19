import { Request, Response } from "express";
import { createTaskTime as createTaskTimeModel, updateTaskTime as updateTaskTimeModel, getTaskTimes as getTaskTimesModel, createTaskTime } from "../models/task_times.model";
import connection from "../services/db.connection";
import { RowDataPacket } from "mysql2";

// Создание записи времени выполнения задачи
export const createTaskTimeController = async (req: Request, res: Response) => {
  const { task_id, user_id, start_time, end_time, duration } = req.body;

  console.log("Received data:", { task_id, user_id, start_time, end_time, duration });

  if (!task_id || !user_id || !start_time || !end_time || (!duration && duration !== 0)) {
    return res.status(400).send("Invalid data: Missing required fields");
  }

  const startTimeFormatted = new Date(start_time).toISOString().slice(0, 19).replace("T", " ");
  const endTimeFormatted = new Date(end_time).toISOString().slice(0, 19).replace("T", " ");

  try {
    await createTaskTimeModel({ task_id, user_id, start_time: startTimeFormatted, end_time: endTimeFormatted, duration });
    res.status(201).json({ message: "Task time created successfully" });
  } catch (error: any) {
    console.error("Error creating task time:", error.message);
    res.status(500).send(`Error creating task time: ${error.message}`);
  }
};

// Обновление записи времени выполнения задачи
export const updateTaskTimeController = async (req: Request, res: Response) => {
  const { id, task_id, user_id, start_time, end_time, duration } = req.body;

  const startTimeFormatted = new Date(start_time).toISOString().slice(0, 19).replace("T", " ");
  const endTimeFormatted = new Date(end_time).toISOString().slice(0, 19).replace("T", " ");

  try {
    await updateTaskTimeModel({ id, user_id, task_id, start_time: startTimeFormatted, end_time: endTimeFormatted, duration });
    res.status(200).json({ message: "Task time updated successfully" });
  } catch (error: any) {
    res.status(500).send(`Error updating task time: ${error.message}`);
  }
};

// Отметить задачу как выполненную
export const markTaskAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connection.query("UPDATE tasks SET is_done = true WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Удаление задачи и связанных с ней записей времени
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await connection.query("DELETE FROM task_times WHERE task_id = ?", [id]);
    await connection.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
};

// Получение статуса таймера
export const getTimerStatus = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM task_times WHERE task_id = ? ORDER BY start_time DESC LIMIT 1",
      [taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No timer found for this task" });
    }

    const timerStatus = rows[0];
    res.json({
      start_time: timerStatus.start_time,
      is_running: !timerStatus.end_time,
      duration: timerStatus.duration,
    });
  } catch (error: any) {
    console.error("Error fetching timer status:", error.message);
    res.status(500).send(`Error fetching timer status: ${error.message}`);
  }
};

// Запуск таймера
export const startTimerController = async (req: Request, res: Response) => {
  const { task_id, user_id, start_time } = req.body;

  // Проверка на наличие всех обязательных параметров
  if (!task_id || !user_id || !start_time) {
    return res.status(400).send("Invalid data: Missing required fields");
  }

  // Форматирование времени
  const startTimeFormatted = new Date(start_time).toISOString().slice(0, 19).replace("T", " ");

  try {
    // Передаём null для end_time
    await createTaskTime({
      task_id,
      user_id,
      start_time: startTimeFormatted,
      end_time: null,
      duration: 0,
    });

    res.status(201).json({ message: "Timer started successfully" });
  } catch (error: any) {
    console.error("Error starting timer:", error.message);
    res.status(500).send(`Error starting timer: ${error.message}`);
  }
};

// Обновление таймера
export const updateTimerController = async (req: Request, res: Response) => {
  const { task_id, elapsed_time, is_running } = req.body;

  if (!task_id || elapsed_time === undefined || is_running === undefined) {
    return res.status(400).send("Invalid data: Missing required fields");
  }

  try {
    await connection.query(
      "UPDATE task_times SET duration = ?, end_time = ? WHERE task_id = ? AND end_time IS NULL",
      [elapsed_time, is_running ? null : new Date().toISOString().slice(0, 19).replace("T", " "), task_id]
    );
    res.status(200).json({ message: "Timer updated successfully" });
  } catch (error: any) {
    console.error("Error updating timer:", error.message);
    res.status(500).send(`Error updating timer: ${error.message}`);
  }
};
