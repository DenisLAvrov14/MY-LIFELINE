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
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Получение всех задач (Todos)
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_connection_1.default.query("SELECT * FROM tasks");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching todos:", error.message);
        res.status(500).send(error.message);
    }
});
exports.getTodos = getTodos;
// Создание новой задачи (Todo)
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, is_done } = req.body;
    try {
        const result = yield db_connection_1.default.query("INSERT INTO tasks (description, is_done) VALUES ($1, $2) RETURNING *", [description, is_done]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating todo:", error.message);
        res.status(500).send(error.message);
    }
});
exports.createTodo = createTodo;
// Обновление задачи (Todo)
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, is_done } = req.body;
    console.log("Updating todo with ID:", id, "Description:", description, "Is Done:", is_done);
    try {
        const result = yield db_connection_1.default.query("UPDATE tasks SET description = $1, is_done = $2 WHERE id = $3 RETURNING *", [description, is_done, id]);
        console.log("Update result:", result.rows[0]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating todo:", error.message);
        res.status(500).send(error.message);
    }
});
exports.updateTodo = updateTodo;
// Удаление задачи (Todo)
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.default.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting todo:", error.message);
        res.status(500).send(error.message);
    }
});
exports.deleteTodo = deleteTodo;
