// connect 4 websocket server
import express from "express";
import { createServer } from "http";
import { Server, WebSocket } from "ws";

const app = express();

const server = createServer(app);

const wss = new Server({ server });

wss.on("connection", (ws: WebSocket) => {
	console.log("client connected");
	ws.on("message", (message: string) => {
		console.log(message);
	});
});

server.listen(8080, () => {
	console.log("listening on port 8080");
});
