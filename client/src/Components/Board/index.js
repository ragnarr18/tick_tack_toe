import React from 'react';
import styles from './styles.module.css';

class Board extends React.Component{
    render(){
        const{ board, myTurn, select, symbol, gameOver } = this.props;
        let disabled;
        let message = "";
        if(gameOver){
            message = "Game Over!";
        }
        else{
            if(myTurn){
                message = "Your Turn";
            }
            else{
                message= "Other player's turn";
            }
        }
        if(!myTurn){
            disabled = true;
        }
        else{
            disabled = false;
        }
        return(
            <div className={styles["container"]}>
            <div className={styles["grid"]}>
                {board.map((element, index) => 
                <div key={index} className={styles["box"]} aria-disabled={disabled} onClick={() => element === '-' && !disabled && select(index)}>
                    {element === '-' ?
                        <div />
                        :
                        <div className={styles[element]} />
                    }
                </div> )}
            </div>

            <div className={styles["info"]} >
            <div className={styles["title"]}>You are playing as</div>
                <div className={styles["symbolBox"]}>
                <div className={styles[symbol]} aria-disabled={disabled}></div> 
                </div>
                <div className={styles["myTurn"]}>{message}</div>
            </div>
            </div>
        )
    }
}
export default Board;