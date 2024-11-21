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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTaskAsDone = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Получение всех задач
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_connection_1.default.query("SELECT * FROM tasks");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).send(error.message);
    }
});
exports.getTasks = getTasks;
// Создание новой задачи
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, is_done } = req.body;
    try {
        const result = yield db_connection_1.default.query("INSERT INTO tasks (description, is_done) VALUES ($1, $2) RETURNING *", [description, is_done]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.createTask = createTask;
// Обновление задачи
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, is_done } = req.body;
    console.log(`Updating task with ID: ${id}`);
    console.log(`New description: ${description}`);
    console.log(`New is_done status: ${is_done}`);
    try {
        const result = yield db_connection_1.default.query("UPDATE tasks SET description = $1, is_done = $2 WHERE id = $3 RETURNING *", [description, is_done, id]);
        console.log(`Update result:`, result.rows[0]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.updateTask = updateTask;
// Удаление задачи
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.default.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.deleteTask = deleteTask;
// Отметить задачу как выполненную
const markTaskAsDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_connection_1.default.query("UPDATE tasks SET is_done = true WHERE id = $1 RETURNING *", [id]);
        res.status(200).json({ message: "Task marked as done", task: result.rows[0] });
    }
    catch (error) {
        console.error("Error marking task as done:", error.message);
        res.status(500).send(`Error marking task as done: ${error.message}`);
    }
});
exports.markTaskAsDone = markTaskAsDone;
