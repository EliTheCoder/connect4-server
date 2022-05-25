export enum Piece {
	NONE,
	RED,
	YELLOW,
}

export class Game {
	private state: number[][];
	private width: number;
	private height: number;
	private turn: Piece.RED | Piece.YELLOW = Piece.YELLOW;
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.state = [];
		for (let i = 0; i < width; i++) {
			this.state[i] = [];
			for (let j = 0; j < height; j++) {
				this.state[i][j] = Piece.NONE;
			}
		}
	}

	public getState(): number[][] {
		return this.state;
	}

	public isTurn(color: Piece.RED | Piece.YELLOW): boolean {
		return this.turn === color;
	}

	public move(column: number, color: Piece.RED | Piece.YELLOW): boolean {
		if (column < 0 || column >= this.width) {
			throw new Error("Invalid column");
		}
		this.turn = this.turn === Piece.RED ? Piece.YELLOW : Piece.RED;
		for (let i = 0; i < this.height; i++) {
			if (this.state[column][i] === Piece.NONE) {
				this.state[column][i] = color;
				return true;
			}
		}
		return false;
	}

	public getWinner(): Piece {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				if (this.state[i][j] !== Piece.NONE) {
					if (this.isWinner(i, j, this.state[i][j])) {
						return this.state[i][j];
					}
				}
			}
		}
		return Piece.NONE;
	}

	private isWinner(x: number, y: number, color: Piece): boolean {
		if (
			this.isWinnerHorizontal(x, y, color) ||
			this.isWinnerVertical(x, y, color) ||
			this.isWinnerDiagonal(x, y, color)
		) {
			return true;
		}
		return false;
	}

	private isWinnerHorizontal(x: number, y: number, color: Piece): boolean {
		let count = 1;
		for (let i = x - 1; i >= 0; i--) {
			if (this.state[i][y] === color) {
				count++;
			} else {
				break;
			}
		}
		for (let i = x + 1; i < this.width; i++) {
			if (this.state[i][y] === color) {
				count++;
			} else {
				break;
			}
		}
		if (count >= 4) {
			return true;
		}
		return false;
	}

	public isWinnerVertical(x: number, y: number, color: Piece): boolean {
		let count = 1;
		for (let i = y - 1; i >= 0; i--) {
			if (this.state[x][i] === color) {
				count++;
			} else {
				break;
			}
		}
		for (let i = y + 1; i < this.height; i++) {
			if (this.state[x][i] === color) {
				count++;
			} else {
				break;
			}
		}
		if (count >= 4) {
			return true;
		}
		return false;
	}

	public isWinnerDiagonal(x: number, y: number, color: Piece): boolean {
		let count = 1;
		for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
			if (this.state[i][j] === color) {
				count++;
			} else {
				break;
			}
		}
		for (
			let i = x + 1, j = y + 1;
			i < this.width && j < this.height;
			i++, j++
		) {
			if (this.state[i][j] === color) {
				count++;
			} else {
				break;
			}
		}
		if (count >= 4) {
			return true;
		}
		return false;
	}

	public toString(): string {
		let result = "";
		for (let i = this.height; i >= 0; i--) {
			for (let j = 0; j < this.width; j++) {
				let char = "";
				switch (this.state[j][i]) {
					case Piece.NONE:
						char = ".";
						break;
					case Piece.RED:
						char = "x";
						break;
					case Piece.YELLOW:
						char = "o";
						break;
				}
				result += char + " ";
			}
			result += "\n";
		}
		return result;
	}
}
