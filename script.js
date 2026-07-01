const gameBoard = (() => {

    const rows = 3;
    const cols = 3;

    const board = Array.from({ length: rows }, () => Array(cols).fill(" "));

    function getBoard() {
        return board;
    }

    function getBlocksFilled() {

        let count = 0;

        for (let i = 0; i < rows; i++) {

            for (let j = 0; j < cols; j++) {

                if (board[i][j] != " ") {

                    count++;
                }
            }
        }

        return count;
    }

    function putMarker(rowIndex, colIndex, marker) {

        if (board[rowIndex][colIndex] === " ") {

            board[rowIndex][colIndex] = marker;

            return true;
        }

        else {

            return false;
        }

    }

    function resetBoard() {

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                board[row][col] = " ";
            }
        }

    }

    return { getBoard, putMarker, resetBoard, getBlocksFilled };

})();

const gameController = (() => {

    const markers = ['X', 'O', 'V'];
    const MAX_PLAYERS = 2;
    const players = [];
    let currPlayerIndex = 0;
    let gameEnd = false;

    const markerBtns = document.querySelectorAll(".markerBtn");
    const markerError = document.getElementById("markerError");

    const nameInput = document.getElementById("playerNameInput");
    const errorOnInput = document.getElementById("nameError");

    const playerForm = document.getElementById("playerForm");

    const dialog = document.getElementById("playerDialog");

    const playerSetUpMsg = dialog.querySelector("h2");

    const startBtn = document.querySelector("#startBtn");
    const restartBtn = document.querySelector("#restartBtn");

    const playerOneName = document.getElementById("playerOneName");
    const playerOneMarker = document.getElementById("playerOneMarker");
    const playerTwoName = document.getElementById("playerTwoName");
    const playerTwoMarker = document.getElementById("playerTwoMarker");
    const playerOneCard = document.getElementById("playerOne");
    const playerTwoCard = document.getElementById("playerTwo");
    const playerCards = document.querySelectorAll(".playerCard");

    const status = document.getElementById("gameStatus");

    const grid = document.getElementById("board");
    const cells = document.querySelectorAll("#board .cell");

    function updateMarkers() {

        markerBtns.forEach(btn => {

            const marker = btn.dataset.marker;

            if (!markers.includes(marker)) {

                btn.style.display = "none";
            }

            else {

                btn.style.display = "inline-block";
            }

        })

    }

    function NameValidator() {

        const name = nameInput.value.trim();

        if (name === "") {

            errorOnInput.style.display = "block";

        }

        else {

            errorOnInput.style.display = "none";
        }

        return name;

    }

    const markerBtn = (() => {

        let chosenMarker;

        markerBtns.forEach(btn => {

            btn.addEventListener("click", (event) => {

                markerBtns.forEach(btn => {

                    btn.classList.remove("markerBtnSelected");

                })

                chosenMarker = event.target.textContent;
                btn.classList.add("markerBtnSelected");

            })
        })

        function getChosenMarker() {

            return chosenMarker;
        }

        function clearChosenMarker() {

            chosenMarker = undefined;
        }

        return { getChosenMarker, clearChosenMarker };

    })();

    function clearDialog() {

        nameInput.value = "";
        errorOnInput.style.display = "none";
        markerError.style.display = "none";

        updateMarkers();
        markerBtn.clearChosenMarker();

    }

    (function addingPlayerFormEventListener() {

        playerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name = NameValidator();
            const chosenMarker = markerBtn.getChosenMarker();

            if (!chosenMarker) {

                markerError.style.display = "block";

            }

            if (!name || !chosenMarker) {

                return;
            }

            markers.splice(markers.indexOf(chosenMarker), 1);

            Player(name, chosenMarker);

            if (players.length < MAX_PLAYERS) {

                clearDialog();

                playerSetUpMsg.textContent = `Player ${players.length + 1} Set Up`;

            }

            else {

                updatePlayerCards();

                startBtn.style.display = "none";
                restartBtn.style.display = "block"

                dialog.close();

            }

        })

    })();

    (function addingGameBtnsEventListeners() {

        startBtn.addEventListener("click", startGame);

        restartBtn.addEventListener("click", restartGame);

    })();

    function Player(name, chosenMarker) {

        players.push(createPlayer(name, chosenMarker));
    }

    function updatePlayerCards() {

        playerOneName.textContent = players[0].getName();
        playerOneMarker.textContent = players[0].getMarker();

        playerTwoName.textContent = players[1].getName();
        playerTwoMarker.textContent = players[1].getMarker();

        playerOneCard.classList.add("redBorder");
    }

    function createPlayers() {

        playerSetUpMsg.textContent = "Player 1 Set Up";

        dialog.showModal();

    }

    (function addingGridCellsEventListeners() {

        cells.forEach(cell => {

            cell.addEventListener("click", (event) => {

                placeMarker(event.target);
            });
        })

    })();

    function placeMarker(btn) {

        if (gameEnd) {
            return;
        }

        let currPlayer = players[currPlayerIndex];

        const marker = currPlayer.getMarker();

        if (btn.textContent === "") {

            btn.textContent = marker;
            gameBoard.putMarker(btn.dataset.row, btn.dataset.col, marker);

            let won = checkWin(marker);

            if (!won) {

                checkTie();
            }

            if (!gameEnd) {

                currPlayerIndex = (currPlayerIndex + 1) % 2;

                if (currPlayerIndex === 0) {

                    playerOneCard.classList.add("redBorder");
                    playerTwoCard.classList.remove("redBorder");
                }

                else {

                    playerTwoCard.classList.add("redBorder");
                    playerOneCard.classList.remove("redBorder");
                }
            }
        }

        else {

            return;
        }

    }

    function ticTacToe() {

        createPlayers();
    }

    function checkWin(marker) {

        const grid = gameBoard.getBoard();

        let won;

        for (let row = 0; row < 3; row++) {

            if (grid[row][0] === marker && grid[row][1] === marker && grid[row][2] === marker) {

                highlightCells([row, 0], [row, 1], [row, 2]);

                won = true;

                break;
            }
        }

        if (!won) {

            for (let col = 0; col < 3; col++) {

                if (grid[0][col] === marker && grid[1][col] === marker && grid[2][col] === marker) {

                    highlightCells([0, col], [1, col], [2, col]);

                    won = true;

                    break;
                }
            }

        }

        if (!won) {

            if (grid[0][0] === marker && grid[1][1] === marker && grid[2][2] === marker) {

                highlightCells([0, 0], [1, 1], [2, 2]);

                won = true;
            }

        }

        if (!won) {

            if (grid[0][2] === marker && grid[1][1] === marker && grid[2][0] === marker) {

                highlightCells([0, 2], [1, 1], [2, 0]);

                won = true;
            }

        }

        if (won) {

            gameEnd = true;

            status.textContent = `Player: ${players[currPlayerIndex].getName()} wins!`
            status.style.visibility = "visible";

            return true;
        }

        return false;
    }

    function highlightCells(cellOne, cellTwo, cellThree) {

        const cell1 = document.querySelector(`[data-row="${cellOne[0]}"][data-col="${cellOne[1]}"]`);
        const cell2 = document.querySelector(`[data-row="${cellTwo[0]}"][data-col="${cellTwo[1]}"]`);
        const cell3 = document.querySelector(`[data-row="${cellThree[0]}"][data-col="${cellThree[1]}"]`);

        cell1.classList.add("redBg");
        cell2.classList.add("redBg");
        cell3.classList.add("redBg");

    }

    function checkTie() {

        if (gameBoard.getBlocksFilled() === 9) {

            gameEnd = true;

            status.textContent = "It's a tie!";

            status.style.visibility = "visible";

        }

    }

    function clearMarkersFromBoard() {

        cells.forEach(cell => {

            cell.textContent = "";
            cell.classList.remove("redBg");

        })

    }

    function restartGame() {

        gameEnd = false;

        markers.length = 0;
        markers.push("X", "O", "V");

        clearDialog();

        players.length = 0;
        currPlayerIndex = 0;

        gameBoard.resetBoard();
        clearMarkersFromBoard();

        startBtn.style.display = "block";
        restartBtn.style.display = "none"

        markerBtns.forEach(btn => {

            btn.classList.remove("markerBtnSelected");

        })

        playerCards.forEach(card => {

            card.classList.remove("redBorder");

        })

        status.textContent = "";

        ticTacToe();

    }

    function startGame() {

        ticTacToe();
    }

    // return { startGame, restartGame, players };

})()


function createPlayer(name, marker) {

    const playerName = name;
    const chosenMarker = marker;

    function getName() {

        return playerName;
    }

    function getMarker() {

        return chosenMarker;
    }

    return { getName, getMarker };
}

