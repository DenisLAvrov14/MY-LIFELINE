import { connection } from '../services/db.connection';
import { ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  username: string;
  email: string;
}

export const createUser = async (newUser: User): Promise<User> => {
  const query = "INSERT INTO users SET ?";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, newUser);
    return { id: result.insertId, ...newUser };
  } catch (err) {
    console.error("Error creating user: ", err);
    throw err;
  }
};
