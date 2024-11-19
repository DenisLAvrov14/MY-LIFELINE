"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTaskAsDone = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const db_connection_1 = require("../services/db.connection");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_connection_1.connection.query("SELECT * FROM tasks");
        res.json(rows);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, is_done } = req.body;
    try {
        const [result] = yield db_connection_1.connection.query("INSERT INTO tasks (description, is_done) VALUES (?, ?)", [description, is_done]);
        res.status(201).json({ id: result.insertId, description, is_done });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, is_done } = req.body;
    console.log(`Updating task with ID: ${id}`);
    console.log(`New description: ${description}`);
    console.log(`New is_done status: ${is_done}`);
    try {
        const [result] = yield db_connection_1.connection.query("UPDATE tasks SET description = ?, is_done = ? WHERE id = ?", [description, is_done, id]);
        console.log(`Update result: `, result);
        res.sendStatus(204);
    }
    catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).send(error.message);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.connection.query("DELETE FROM tasks WHERE id = ?", [id]);
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.deleteTask = deleteTask;
// Новая функция markTaskAsDone
const markTaskAsDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.connection.query("UPDATE tasks SET is_done = ? WHERE id = ?", [true, id]);
        res.status(200).json({ message: 'Task marked as done' });
    }
    catch (error) {
        res.status(500).send(`Error marking task as done: ${error.message}`);
    }
});
exports.markTaskAsDone = markTaskAsDone;
