// connect 4 websocket server
import express from "express";
import { createServer } from "http";
import { Server, WebSocket } from "ws";
import { Game, Piece } from "./game";

const app = express();

const server = createServer(app);

const wss = new Server({ server });

const game = new Game(7, 6);

let redPlayer: WebSocket;
let yellowPlayer: WebSocket;
let spectators: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
	if (redPlayer === undefined) {
		redPlayer = ws;
		console.log("red player connected");
	} else if (yellowPlayer === undefined) {
		yellowPlayer = ws;
		redPlayer.send("1");
		yellowPlayer.send("2");
		console.log("yellow player connected");
		console.log(game.toString());
	} else {
		spectators.push(ws);
		console.log("spectator connected");
	}

	ws.on("message", (message: Buffer) => {
		if (ws !== redPlayer && ws !== yellowPlayer) return;
		if (redPlayer === undefined || yellowPlayer === undefined) return;
		let otherPlayer: WebSocket;
		let color: Piece;
		if (ws === redPlayer) {
			otherPlayer = yellowPlayer;
			color = Piece.RED;
		} else {
			otherPlayer = redPlayer;
			color = Piece.YELLOW;
		}
		const column = parseInt(message.toString());
		if (!game.isTurn(color)) return;
		if (!game.move(column, color)) return;
		if (game.getWinner() !== Piece.NONE) {
			ws.send("win");
			otherPlayer.send("lose");
			spectators.forEach(spectator => {
				spectator.send("win");
			});
			return;
		}
		otherPlayer.send(JSON.stringify(game.getState()));
		spectators.forEach(spectator => {
			spectator.send(JSON.stringify(game.getState()));
		});
		console.log(game.toString());
	});
});

server.listen(8080, () => {
	console.log("listening on port 8080");
});
