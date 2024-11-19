import { connection } from "../services/db.connection";

export const createTaskTime = async (taskTime: {
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null; // Позволяем null для end_time
  duration: number;
}) => {
  const { task_id, user_id, start_time, end_time, duration } = taskTime;
  const [result] = await connection.query(
    "INSERT INTO task_times (task_id, user_id, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?)",
    [task_id, user_id, start_time, end_time ?? null, duration] // Передаём null, если end_time пустой
  );
  return result;
};

export const updateTaskTime = async (taskTime: {
  id: number;
  task_id: number;
  user_id: number; 
  start_time: string;
  end_time: string;
  duration: number;
}) => {
  const { id, task_id, user_id, start_time, end_time, duration } = taskTime;
  await connection.query(
    "UPDATE task_times SET task_id = ?, user_id = ?, start_time = ?, end_time = ?, duration = ? WHERE id = ?",
    [task_id, user_id, start_time, end_time, duration, id]
  );
};

export const getTaskTimes = async (user_id: number) => {
  const [rows] = await connection.query(
    "SELECT * FROM task_times WHERE user_id = ?",
    [user_id]
  );
  return rows;
};
