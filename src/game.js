// 游戏常量定义
const BOARD_SIZE = 15; // 棋盘大小 15x15
const CELL_CLASS = 'cell'; // 棋盘格子样式类
const PIECE_CLASS = 'piece'; // 棋子样式类
const BLACK_PIECE = 'black'; // 黑棋样式类
const WHITE_PIECE = 'white'; // 白棋样式类

// 游戏状态类
class GomokuGame {
    constructor() {
        // 初始化游戏状态
        this.board = []; // 棋盘数组
        this.currentPlayer = BLACK_PIECE; // 当前玩家，默认黑棋先行
        this.gameOver = false; // 游戏是否结束
        this.winner = null; // 获胜者

        // 初始化DOM元素
        this.gameBoard = document.getElementById('game-board');
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.restartButton = document.getElementById('restart-btn');

        this.init();
    }

    // 初始化游戏
    init() {
        this.createBoard(); // 创建棋盘
        this.bindEvents(); // 绑定事件
        this.updateDisplay(); // 更新显示
    }

    // 创建棋盘
    createBoard() {
        this.gameBoard.innerHTML = ''; // 清空棋盘
        this.board = []; // 重置棋盘数组

        // 创建15x15的棋盘
        for (let row = 0; row < BOARD_SIZE; row++) {
            this.board[row] = []; // 初始化行数组

            for (let col = 0; col < BOARD_SIZE; col++) {
                this.board[row][col] = null; // 初始化格子为空

                // 创建格子DOM元素
                const cell = document.createElement('div');
                cell.className = CELL_CLASS;
                cell.dataset.row = row; // 存储行索引
                cell.dataset.col = col; // 存储列索引

                this.gameBoard.appendChild(cell);
            }
        }
    }

    // 绑定事件监听器
    bindEvents() {
        // 棋盘点击事件
        this.gameBoard.addEventListener('click', (event) => {
            const cell = event.target.closest(`.${CELL_CLASS}`);
            if (cell && !this.gameOver) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.handleCellClick(row, col);
            }
        });

        // 重新开始按钮点击事件
        this.restartButton.addEventListener('click', () => {
            this.restart();
        });
    }

    // 处理格子点击
    handleCellClick(row, col) {
        // 检查位置是否已有棋子
        if (this.board[row][col] !== null) {
            this.showMessage('该位置已有棋子！');
            return;
        }

        // 放置棋子
        this.placePiece(row, col, this.currentPlayer);

        // 检查是否获胜
        if (this.checkWin(row, col, this.currentPlayer)) {
            this.handleWin();
            return;
        }

        // 检查是否平局
        if (this.checkDraw()) {
            this.handleDraw();
            return;
        }

        // 切换玩家
        this.switchPlayer();
        this.updateDisplay();
    }

    // 放置棋子
    placePiece(row, col, player) {
        this.board[row][col] = player; // 更新棋盘数据

        // 找到对应的格子元素
        const cell = this.gameBoard.querySelector(
            `.${CELL_CLASS}[data-row="${row}"][data-col="${col}"]`
        );

        // 创建棋子元素
        const piece = document.createElement('div');
        piece.className = `${PIECE_CLASS} ${player}`;

        cell.appendChild(piece); // 添加棋子到格子
    }

    // 检查获胜条件
    checkWin(row, col, player) {
        // 四个方向需要检查：水平、垂直、对角线1、对角线2
        const directions = [
            [[0, 1], [0, -1]],   // 水平方向
            [[1, 0], [-1, 0]],   // 垂直方向
            [[1, 1], [-1, -1]],  // 对角线方向
            [[1, -1], [-1, 1]]   // 反对角线方向
        ];

        // 遍历所有方向
        for (const direction of directions) {
            let count = 1; // 当前方向的连续棋子数，包括当前棋子

            // 检查正方向
            for (const [dRow, dCol] of [direction[0]]) {
                let r = row + dRow;
                let c = col + dCol;

                while (
                    r >= 0 && r < BOARD_SIZE &&
                    c >= 0 && c < BOARD_SIZE &&
                    this.board[r][c] === player
                ) {
                    count++;
                    r += dRow;
                    c += dCol;
                }
            }

            // 检查反方向
            for (const [dRow, dCol] of [direction[1]]) {
                let r = row + dRow;
                let c = col + dCol;

                while (
                    r >= 0 && r < BOARD_SIZE &&
                    c >= 0 && c < BOARD_SIZE &&
                    this.board[r][c] === player
                ) {
                    count++;
                    r += dRow;
                    c += dCol;
                }
            }

            // 如果连续5个或以上棋子，获胜
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查平局
    checkDraw() {
        // 检查棋盘是否已满
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (this.board[row][col] === null) {
                    return false; // 还有空位，不是平局
                }
            }
        }
        return true; // 棋盘已满，平局
    }

    // 处理获胜
    handleWin() {
        this.gameOver = true;
        this.winner = this.currentPlayer;
        const winnerName = this.winner === BLACK_PIECE ? '黑棋' : '白棋';

        this.showMessage(`🎉 ${winnerName}获胜！`);

        // 添加获胜动画效果
        this.gameBoard.classList.add('winner-animation');
    }

    // 处理平局
    handleDraw() {
        this.gameOver = true;
        this.showMessage('🤝 平局！');
    }

    // 切换玩家
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === BLACK_PIECE ? WHITE_PIECE : BLACK_PIECE;
    }

    // 更新显示
    updateDisplay() {
        const playerName = this.currentPlayer === BLACK_PIECE ? '黑棋' : '白棋';
        this.currentPlayerElement.textContent = playerName;
        this.currentPlayerElement.style.color = this.currentPlayer === BLACK_PIECE ? '#000' : '#666';
    }

    // 显示消息
    showMessage(message) {
        this.gameStatusElement.textContent = message;
    }

    // 重新开始游戏
    restart() {
        // 重置游戏状态
        this.currentPlayer = BLACK_PIECE;
        this.gameOver = false;
        this.winner = null;

        // 移除获胜动画
        this.gameBoard.classList.remove('winner-animation');

        // 重新创建棋盘
        this.createBoard();

        // 更新显示
        this.updateDisplay();
        this.showMessage('点击棋盘开始游戏');
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});