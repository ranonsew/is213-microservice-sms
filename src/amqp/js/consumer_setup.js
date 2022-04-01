"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const rabbitHost = process.env.rabbit_host || 'localhost';
const rabbitPort = process.env.rabbit_port || 5672;
/**
 *
 * @returns {Promise<amqp.Channel>} an amqp channel that is connected to the RabbitMQ
 */
async function openConnection() {
    const connection = await amqplib_1.default.connect({
        protocol: 'amqp',
        hostname: rabbitHost,
        port: rabbitPort,
        locale: 'en_US',
        heartbeat: 3600
    });
    return await connection.createChannel();
}
exports.openConnection = openConnection;
