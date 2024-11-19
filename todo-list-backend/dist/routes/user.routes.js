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
const express_1 = require("express");
const db_connection_1 = require("../services/db.connection");
const router = (0, express_1.Router)();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = req.body;
    const query = "INSERT INTO users SET ?";
    try {
        const [result] = yield db_connection_1.connection.query(query, newUser);
        res.status(201).json(Object.assign({ id: result.insertId }, newUser));
    }
    catch (err) {
        console.error("Error creating user: ", err);
        res.status(500).send('Error creating user');
    }
});
router.post("/users", createUser);
exports.default = router;
