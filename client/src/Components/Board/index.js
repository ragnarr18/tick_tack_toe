import React from 'react';
import styles from './styles.module.css';

class Board extends React.Component{

    render(){
        const{ board, myTurn, select, symbol } = this.props;
        let disabled;
        console.log("myturn board: " ,myTurn);
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
                <div className={styles["box"]} aria-disabled={disabled} onClick={() => element === '-' && !disabled && select(index)}>
                    {element === '-' ?
                        <div />
                        :
                        <div className={styles[element]} />
                    }
                </div> )}
            </div>

            <div className={styles["symbolBox"]}>
                <div className={styles["title"]}>You are playing as</div>
                <div className={styles[symbol]} aria-disabled={disabled}>
                </div> 
            </div>
            {myTurn ?
            <div className={styles["myTurn"]} >your turn</div> : <div className={styles["myTurn"]}>wait</div> }
            </div>
        )
    }
}
export default Board;