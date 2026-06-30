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

            console.log(`Marker ${marker} placed at row: ${rowIndex} and col: ${colIndex}`);

            return true;
        }

        else {

            console.log(`Invalid Entry at row: ${rowIndex} and col: ${colIndex}, try again`);

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
    const board = gameBoard;

    let currPlayerIndex = 0;

    function updateMarkers() {

        const markerBtns = document.querySelectorAll(".markerBtn");

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

        const nameInput = document.getElementById("playerNameInput");
        const errorOnInput = document.getElementById("nameError");

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

        const btns = document.querySelectorAll(".markerBtn");

        let chosenMarker;

        btns.forEach(btn => {

            btn.addEventListener("click", (event) => {

                btns.forEach(btn => {

                    btn.classList.remove("markerBtnSelected");

                })

                chosenMarker = event.target.textContent;
                btn.classList.add("markerBtnSelected");

            })
        })

        function getChosenMarker() {

            return chosenMarker;

        }

        return { getChosenMarker };

    })();

    function updateDialog() {

        const nameInput = document.getElementById("playerNameInput");
        const errorOnInput = document.getElementById("nameError");
        const markerError = document.getElementById("markerError");

        nameInput.value = "";
        errorOnInput.style.display = "none";
        markerError.style.display = "none";

        updateMarkers();

    }

    (function addingPlayerFormEventListener() {

        const playerForm = document.getElementById("playerForm");

        playerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name = NameValidator();
            const chosenMarker = markerBtn.getChosenMarker();

            if (!chosenMarker) {

                const markerError = document.getElementById("markerError");

                markerError.style.display = "block";

            }

            if (!name || !chosenMarker) {

                return;
            }

            const dialog = document.getElementById("playerDialog");
            const playerSetUpMsg = dialog.querySelector("h2");

            markers.splice(markers.indexOf(chosenMarker), 1);

            Player(name, chosenMarker);

            if (players.length < MAX_PLAYERS) {

                updateDialog();

                playerSetUpMsg.textContent = `Player ${players.length + 1} Set Up`;

            }

            else {

                updatePlayerCards();

                dialog.close();

            }

        })

    })();


    function Player(name, chosenMarker) {

        players.push(createPlayer(name, chosenMarker));

    }

    function updatePlayerCards() {

        const playerOneName = document.getElementById("playerOneName");
        const playerOneMarker = document.getElementById("playerOneMarker");

        const playerTwoName = document.getElementById("playerTwoName");
        const playerTwoMarker = document.getElementById("playerTwoMarker");

        const playerOneCard = document.getElementById("playerOne");

        playerOneName.textContent = players[0].getName();
        playerOneMarker.textContent = players[0].getMarker();

        playerTwoName.textContent = players[1].getName();
        playerTwoMarker.textContent = players[1].getMarker();

        playerOneCard.classList.add("redBorder");
    }

    function createPlayers() {

        const dialog = document.getElementById("playerDialog");
        const playerSetUpMsg = dialog.querySelector("h2");

        playerSetUpMsg.textContent = "Player 1 Set Up";

        dialog.showModal();

    }

    (function addingGridCellsEventListeners() {

        const cells = document.querySelectorAll("#board .cell");

        cells.forEach(cell => {

            cell.addEventListener("click", (event) => {

                placeMarker(event.target);
            });
        })

    })();

    function placeMarker(btn) {

        let currPlayer = players[currPlayerIndex];

        const marker = currPlayer.getMarker();

        const playerOneCard = document.getElementById("playerOne");
        const playerTwoCard = document.getElementById("playerTwo");

        if (btn.textContent === "") {

            btn.textContent = marker;
            board.putMarker(btn.dataset.row, btn.dataset.col, marker);

            checkWin(marker);
            checkTie();

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

        else {

            return;
        }

    }

    function ticTacToe() {

        createPlayers();

    }

    function checkWin(marker) {

        const grid = board.getBoard();

        const status = document.getElementById("gameStatus");

        let won;

        for (let row = 0; row < 3; row++) {

            if (grid[row][0] === marker && grid[row][1] === marker && grid[row][2] === marker) {

                highlightCells([row, 0], [row, 1], [row, 2]);

                won = true;
            }
        }

        for (let col = 0; col < 3; col++) {

            if (grid[0][col] === marker && grid[1][col] === marker && grid[2][col] === marker) {

                highlightCells([0, col], [1, col], [2, col]);

                won =  true;
            }
        }

        if (grid[0][0] === marker && grid[1][1] === marker && grid[2][2] === marker) {

            highlightCells([0, 0], [1, 1], [2, 2]);

            won = true;
        }

        if (grid[0][2] === marker && grid[1][1] === marker && grid[2][0] === marker) {

            highlightCells([0, 2], [1, 1], [2, 0]);

            won = true;
        }

        if(won) {

            status.textContent = `Player: ${players[currPlayerIndex].getName()} wins!`
            status.style.visibility = "visible";
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

        if (board.getBlocksFilled() === 9) {

            const status = document.getElementById("gameStatus");

            status.textContent = "It's a tie!";

            status.style.visibility = "visible";

        }

    }

    function restartGame() {

        markers.length = 0;

        markers.push("X", "O", "V");

        players.length = 0;

        board.resetBoard();

        startBtn.hidden = false;
        restartBtn.hidden = true;

        ticTacToe();

    }

    function startGame() {

        ticTacToe();
    }

    return { startGame, restartGame, players };

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


const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");

startBtn.addEventListener("click", gameController.startGame);

restartBtn.addEventListener("click", gameController.restartGame);
