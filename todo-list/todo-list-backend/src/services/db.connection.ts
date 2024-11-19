import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db.config';

export const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

export const connectDatabase = async () => {
  try {
    await connection.getConnection();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export default connection;
