import React from 'react';
import withAuth from '../Authorization';
import Board from '../Board';
import UserModal from '../Modal';
import styles from './styles.module.css';
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
            isOpen: false,
        }
    }

    async componentDidMount(){
        const { socket, match } = this.props;
        socket.emit('ready', match.params.matchId )
        socket.on('assign_symbol', symbol => {
            if(symbol === 'X'){
                this.setState({myTurn: true});
            }
            this.setState({symbol: symbol});
        })

        socket.on('game_move', (symbol, idx) => {
            const symbolState = this.state.symbol;
            let { win, lose, draw } = this.state;
            let myTurn = false;
                if(symbol !== symbolState){
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
            this.setState({isOpen: true})
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        socket.off('assign_symbol')
        socket.off('game_move')
        socket.off('match_ended')
    }

    matchContainsUser(match){
        const { session } = this.props;
        const {username } = session;
        if(match.participants[0].username === username || match.participants[1].username === username ){
            return true;
        }
        return false;
    }
    
    //game logic
    isGameWinningMove(board){
        const {symbol } = this.state;
        for(let i = 0; i < board.length /3 ; i++){
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
            }
            let j = i + i + i;
                if(board[j]===symbol){
                    if((board[j] === board[j+1]) && (board[j+1] === board[j+2])){ //left to right
                        console.log("is winning move");
                        return true;
                    }
                }
        }
        return false;
    }

    //game logic
    isDraw(board){
        const { symbol } = this.state;
        const other = (symbol === 'O') ? "X": 'O';
        for(let i = 0; i < board.length; i++){
            if(board[i] !== symbol && board[i] !==other){
                return false;
            }
        }
        console.log("is draw");
        return true;
    }

    select(index){
        const { socket, match } = this.props;
        const { symbol, myTurn } = this.state;
        if(myTurn){
            let copyBoard = [...this.state.board];
            copyBoard[index] = symbol;
            this.setState({board: copyBoard, myTurn: false })
            socket.emit('game_move', match.params.matchId, symbol, index, this.isGameWinningMove(copyBoard), this.isDraw(copyBoard))
        }
    }
    
    openModal(status){
            this.setState({isOpen: status})
    }
    
    render(){
        const{ board, myTurn, win, draw, lose, symbol } = this.state;
        const { history } = this.props;
        return(
            <div>
                {win && <div className={styles["GameOver"]} >you win!</div> }
                {draw && <div className={styles["GameOver"]} >its a draw!</div> }
                {lose && <div className={styles["GameOver"]} >you lose!</div> }
                <Board myTurn={myTurn} symbol={symbol} gameOver={draw || lose || win} board={board} select={(index) => this.select(index)}/>
                <UserModal isOpen={this.state.isOpen} closeModel={() => this.openModal(false)} >
                    {win && <div>you win!</div> }
                    {draw &&<div>its a draw!</div> }
                    {lose &&<div >you lose!</div> }
                    <div>Game Over!</div>
                    <button onClick={() => history.push("/dashboard")}>Go back to dashboard</button>
                </UserModal>
            </div>
        )
    }
}
export default withAuth(Match);