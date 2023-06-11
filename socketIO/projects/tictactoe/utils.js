const checkVictory = (match) => {
    //Horizontal Win
    if(match.board[0].every(c=>c==="O") || match.board[1].every(c=>c==="O")|| match.board[2].every(c=>c==="O")) {
        return "O"
    }
    if(match.board[0].every(c=>c==="X") || match.board[1].every(c=>c==="X")|| match.board[2].every(c=>c==="X")) {
        return "X"
    }

    //Vertical Win
    for(let i = 0; i < 3; i++) {
        if(match.board[0][i] === "O" && match.board[1][i] === "O" && match.board[2][i] === "O") {
            return "O"
        }
        if(match.board[0][i] === "X" && match.board[1][i] === "X" && match.board[2][i] === "X") {
            return "X"
        }
    }

    //Diagonal Win
    if((match.board[0][0] === "O" && match.board[1][1] === "O" && match.board[2][2] === "O") || (match.board[2][0] === "O" && match.board[1][1] === "O" && match.board[0][2] === "O")) {
        return "O"
    }
    if((match.board[0][0] === "X" && match.board[1][1] === "X" && match.board[2][2] === "X") || (match.board[2][0] === "X" && match.board[1][1] === "X" && match.board[0][2] === "X")) {
        return "X"
    }

    //Tie
    const tie = match.board.flat()
    if(tie.every(c=>c != "")) return "T"

    //Not finished yet
    return ""
}

module.exports = {checkVictory}