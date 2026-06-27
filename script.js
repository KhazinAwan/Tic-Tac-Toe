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

    function showMarkers() {
        console.log("Available markers: ", markers);
    }

    function enterName() {

        const name = prompt("Enter your name:");

        return name;

    }

    function chooseMarker(name) {

        showMarkers();

        let index = 0;
        let chosenMarker;

        do {

            const input = prompt(`Player ${name}, Enter the marker of your choice:`);

            index = markers.indexOf(input);

            if (index > -1) {

                chosenMarker = markers[index];
                markers.splice(index, 1);  
            }

            else {

                console.log("Wrong input, Please try again");
            }

        } while (index === -1);

        return chosenMarker;
    }

    function createPlayers() {

        players.length = 0;


        for (let i = 0; i < MAX_PLAYERS; i++) {

            const name = enterName();

            const marker = chooseMarker(name);

            const player = createPlayer(name, marker, i+1);

            players.push(player);

        }
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

                const input = prompt("Would you like to restart?(y/n)").toLowerCase();

                if(input === 'y') {

                    markers.length = 0;

                    markers.push("X", "O", "V");

                    players.length = 0;

                    board.resetBoard();

                    gameEnd = false;

                    return true;

                }

                else {

                    console.log("BYE BYE!");
                    return false;
                }

            }

        }

    }

    function ticTacToe() {

        let play;

        do {

            play = playOneGame();


        } while(play);

        console.log("Thanks for playing!");
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

    return {ticTacToe, players};
    
})()


function createPlayer(name, marker, number) {

    const playerName = `Player ${number}: ` + name;
    const chosenMarker = marker;

    function getName() {

        return playerName;
    }

    function getMarker() {

        return chosenMarker;
    }

    function getPlayerDetails() {

        console.log(`${playerName} with marker ${chosenMarker}`);
    }

    return {getName, getMarker, getPlayerDetails};
}


gameController.ticTacToe();