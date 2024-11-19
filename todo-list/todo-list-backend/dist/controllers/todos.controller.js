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
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const db_connection_1 = require("../services/db.connection");
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_connection_1.connection.query("SELECT * FROM tasks");
        res.json(rows);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getTodos = getTodos;
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, is_done } = req.body;
    try {
        const [result] = yield db_connection_1.connection.query("INSERT INTO tasks (description, is_done) VALUES (?, ?)", [description, is_done]);
        res.status(201).json({ id: result.insertId, description, is_done });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.createTodo = createTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, is_done } = req.body;
    console.log("Updating todo with ID:", id, "Description:", description, "Is Done:", is_done);
    try {
        yield db_connection_1.connection.query("UPDATE tasks SET description = ?, is_done = ? WHERE id = ?", [description, is_done, id]);
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error updating task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.connection.query("DELETE FROM tasks WHERE id = ?", [id]);
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.deleteTodo = deleteTodo;
