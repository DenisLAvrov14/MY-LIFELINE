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
exports.connectDatabase = exports.connection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const db_config_1 = require("../config/db.config");
exports.connection = promise_1.default.createPool({
    host: db_config_1.dbConfig.HOST,
    user: db_config_1.dbConfig.USER,
    password: db_config_1.dbConfig.PASSWORD,
    database: db_config_1.dbConfig.DB,
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.connection.getConnection();
        console.log('Successfully connected to the database.');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
exports.default = exports.connection;
