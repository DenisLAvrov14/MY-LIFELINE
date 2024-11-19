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
exports.getTaskTimes = exports.updateTaskTime = exports.createTaskTime = void 0;
const db_connection_1 = require("../services/db.connection");
const createTaskTime = (taskTime) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, user_id, start_time, end_time, duration } = taskTime;
    const [result] = yield db_connection_1.connection.query("INSERT INTO task_times (task_id, user_id, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?)", [task_id, user_id, start_time, end_time !== null && end_time !== void 0 ? end_time : null, duration] // Передаём null, если end_time пустой
    );
    return result;
});
exports.createTaskTime = createTaskTime;
const updateTaskTime = (taskTime) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, task_id, user_id, start_time, end_time, duration } = taskTime;
    yield db_connection_1.connection.query("UPDATE task_times SET task_id = ?, user_id = ?, start_time = ?, end_time = ?, duration = ? WHERE id = ?", [task_id, user_id, start_time, end_time, duration, id]);
});
exports.updateTaskTime = updateTaskTime;
const getTaskTimes = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_connection_1.connection.query("SELECT * FROM task_times WHERE user_id = ?", [user_id]);
    return rows;
});
exports.getTaskTimes = getTaskTimes;
