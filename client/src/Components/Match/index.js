import React from 'react';
import withAuth from '../Authorization';
import Board from '../Board';
class Match extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            symbol: '',
            board: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
            myTurn: false,
            win: false,
            draw: false,
            lose: false,
        }
    }

    componentDidMount(){
        console.log("match: ",this.props);
        const { socket, match } = this.props;
        socket.emit('ready', match.params.matchId )
        socket.on('assign_symbol', symbol => {
            console.log("symbol: ", symbol);
            if(symbol === 'X'){
                this.setState({myTurn: true});
            }
            this.setState({symbol: symbol});
        })

        socket.on('game_move', (symbol, idx) => {
            console.log("recv game_move: ", symbol, idx);
            const symbolState = this.state.symbol;
            let { win, lose, draw } = this.state;
            let myTurn = false;
            console.log("win, lose draw", win, lose,draw);
                if(symbol !== symbolState){
                    console.log("setNewSymbol", this.state);
                    let copyBoard = [...this.state.board];
                    copyBoard[idx] = symbol;
                    if(win === false && lose ===false && draw ===false){
                        myTurn = true;
                    }
                        this.setState({ board: copyBoard, myTurn: myTurn })
                }
        })

        socket.on('match_ended', (matchId, winner) => {
            const { symbol } = this.state;
            if(winner === null){
                console.log("it was a draw!");
                this.setState({draw: true, myTurn: false})
            }
            else{
                console.log("the winner is: ", winner);
                if(winner.symbol === symbol){
                    this.setState({win: true, myTurn: false})
                }
                else{
                    this.setState({lose: true, myTurn: false})
                }
            }
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        socket.off('assign_symbol')
        socket.off('game_move')
        socket.off('match_ended')
    }
    
    //game logic
    isGameWinningMove(board){
        const {symbol } = this.state;
        for(let i = 0; i < board.length /3 ; i++){
            console.log("i: ", i);
            if(board[i] === symbol){
                if(i === 0){
                    if((board[i] === board[i+4]) &&(board[i + 4] === board[i+8])){ //dioganal left right, top down
                        console.log("is winning move");
                        return true;
                    }
                }
                if(i === 2){
                    if((board[i] === board[i+2]) &&(board[i +2] === board[i+4])){ //dioganal right to left, top down
                        console.log("is winning move");
                        return true;
                    }
                }
                if((board[i] === board[i+3]) && (board[i+3] === board[i+6])){ //down up
                    console.log("is winning move");
                    return true;
                }
                let j = i + i + i;
                if(board[j]===symbol){
                    console.log("j: ", board[j], board[j+1], board[j+2], board[j] === (board[j+1] === board[j+2]) );
                    if((board[j] === board[j+1]) && (board[j+1] === board[j+2])){ //left to right
                        console.log("is winning move");
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //game logic
    isDraw(board){
        const { symbol } = this.state;
        const other = (symbol === 'O') ? "X": 'O';
        console.log("other: ",other);
        for(let i = 0; i < board.length; i++){
            if(board[i] !== symbol && board[i] !==other){
                return false;
            }
        }
        console.log("is draw");
        return true;
    }

    select(index){
        console.log("select: ", index);
        const { socket, match } = this.props;
        const { symbol, myTurn } = this.state;
        if(myTurn){
            let copyBoard = [...this.state.board];
            copyBoard[index] = symbol;
            console.log("draw?: ", this.isDraw(copyBoard));
            this.setState({board: copyBoard, myTurn: false })
            socket.emit('game_move', match.params.matchId, symbol, index, this.isGameWinningMove(copyBoard), this.isDraw(copyBoard))
        }
    }
    
    render(){
        const{ board, myTurn, win, draw, lose, symbol } = this.state;
        console.log("state: ", this.state);

        return(
            <div>
                {win && <div>you win!</div> }
                {draw && <div>its a draw!</div> }
                {lose && <div>you lose!</div> }
                <Board myTurn={myTurn} symbol={symbol} board={board} select={(index) => this.select(index)}/>
            </div>
        )
    }
}
export default withAuth(Match);