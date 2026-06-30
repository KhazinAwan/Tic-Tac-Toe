const gameBoard = (() => {

    const rows = 3;
    const cols = 3;

    const board = Array.from({ length: rows }, () => Array(cols).fill(" "));

    function getBoard() {
        return board;
    }

    function getBlocksFilled() {

        let count = 0;

        for(let i = 0; i < rows; i++) {

            for(let j = 0; j < cols; j++) {

                if(board[i][j] != " ") {

                    count++;
                }
            }
        }

        return count;
    }

    function placeMarker(rowIndex, colIndex, marker) {

        if(board[rowIndex][colIndex] === " ") {

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

        for(let row = 0; row < rows; row++ ) {

            for(let col = 0; col < cols; col++) {

                board[row][col] = " ";
            }
        }

    }

    return { getBoard, placeMarker, resetBoard, getBlocksFilled};

})();

const gameController = (() => {

    const markers = ['X', 'O', 'V'];
    const MAX_PLAYERS = 2;
    const players = [];
    const board = gameBoard;
    const MAX_ROUNDS = 5;
    let gameEnd = false;

    function updateMarkers() {

        const markerBtns = document.querySelectorAll(".markerBtn");

        markerBtns.forEach(btn => {

            const marker = btn.dataset.marker;

            if(!markers.includes(marker)) {

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

        if(name === "") {

            errorOnInput.style.display = "block";

        }

        else {

            errorOnInput.style.display = "none";
        }

        return name;

    }

    const markerBtn = (()=> {

       const btns = document.querySelectorAll(".markerBtn");

       let chosenMarker;

       btns.forEach(btn => {

        btn.addEventListener("click" , (event)=> {

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

       return {getChosenMarker};

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

    (function addingEventListeners() { 
        
        const playerForm = document.getElementById("playerForm");

        playerForm.addEventListener("submit" , (event) => {
            
            event.preventDefault();

            const name = NameValidator();
            const chosenMarker = markerBtn.getChosenMarker();

            if(!chosenMarker) {

                const markerError = document.getElementById("markerError");

                markerError.style.display = "block";

            }

            if(!name || !chosenMarker){

                return;
            }

            const dialog = document.getElementById("playerDialog");
            const playerSetUpMsg = dialog.querySelector("h2");

            markers.splice(markers.indexOf(chosenMarker), 1);

            Player(name, chosenMarker);

            if(players.length < MAX_PLAYERS) {

                updateDialog();

                playerSetUpMsg.textContent = `Player ${players.length + 1} Set Up`;

            }

            else {

            dialog.close();

            }

        })

    })();


    function Player(name, chosenMarker) {
            
        players.push(createPlayer(name, chosenMarker));
       
    }

    function createPlayers() {

        const dialog = document.getElementById("playerDialog");
        const playerSetUpMsg = dialog.querySelector("h2");

        playerSetUpMsg.textContent = "Player 1 Set Up";

        dialog.showModal();

    }

    function chooseBlock() {

        let invalidRow = false;
        let invalidCol = false;
        let row;
        let col;

        do {

            row = Number(prompt("Enter row number(1-3)"));

            if((row < 1 || row > 3) || !Number.isInteger(row)) {

                invalidRow = true;
                console.log("Invalid row input. Enter again.")
            }

            else {

                invalidRow = false;
            }

        } while(invalidRow);

        do {

            col = Number(prompt("Enter column number(1-3)"));

            if((col < 1 || col > 3) || !Number.isInteger(col)) {

                invalidCol = true;
                console.log("Invalid col input. Enter again.")
            }

            else {

                invalidCol = false;
            }

        } while(invalidCol);


        return {row, col};
    }

    function checkBlock(row, col) {

        return (board.getBoard()[row][col] === " ");

    }

    function playerTurn(marker) {

        const {row, col} = chooseBlock();

        const valid = checkBlock(row-1, col-1);

        if(valid) {
            board.placeMarker(row-1, col-1, marker);
            return false;
        }

        else {

            console.log("Block already occupied, try another one");
            return true;
        }
    }

    function round() {
    
        for(let i = 0; i < MAX_PLAYERS; i++) {

            let currMarker = players[i].getMarker();

            console.log(`${players[i].getName()}'s turn`);

            let repeatTurn = false;

            do {

                repeatTurn = playerTurn(currMarker);

            } while(repeatTurn);

            if(checkWin(currMarker)) {

                console.log(`HOORAY! ${players[i].getName()} WON`);
                gameEnd = true;
                break;
            }

            if(checkTie()) {

                console.log("ITS A TIE!");
                gameEnd = true;
                break;
            }

        }
    }

    function playOneGame() {

        createPlayers();

        for(let i = 0; i < MAX_ROUNDS; i++) {

            round();

            if(gameEnd) {

                startBtn.hidden = false;
                restartBtn.hidden = true;

                }

                else {

                    return false;
                }

            }

    }


    function restartGame() {

        markers.length = 0;

        markers.push("X", "O", "V");

        players.length = 0;

        board.resetBoard();

        gameEnd = false;

        startBtn.hidden = false;
        restartBtn.hidden = true;

        ticTacToe();

    }

    function ticTacToe() {

        let play;

        do {

            play = playOneGame();


        } while(play);

    }

    function checkWin(marker) {

        const grid = board.getBoard();

        for( let row = 0; row < 3; row++) {

            if( grid[row][0] === marker && grid[row][1] === marker && grid[row][2] === marker) {

                return true;
            }
        }

        for( let col = 0; col < 3; col++) {

            if( grid[0][col] === marker && grid[1][col] === marker && grid[2][col] === marker) {

                return true;
            }
        }

        if((grid[0][0] === marker && grid[1][1] === marker && grid[2][2] === marker) || (grid[0][2] === marker && grid[1][1] === marker && grid[2][0] === marker)) {

                return true;
        }

        return false;
    }

    function checkTie() {

        return (board.getBlocksFilled() === 9);

    }

    function startGame() {
        ticTacToe();
    }

    return {startGame, restartGame, players};
    
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

    return {getName, getMarker};
}


const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");

startBtn.addEventListener("click", gameController.startGame);

restartBtn.addEventListener("click", gameController.restartGame);
