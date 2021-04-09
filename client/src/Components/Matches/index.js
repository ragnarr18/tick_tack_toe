import React from 'react';
import styles from './styles.module.css';

class Matches extends React.Component{

    getUsername(participants){
        const { username } = this.props;
        console.log("username: ", username);
        console.log("participants", participants);
        for (let i = 0; i < participants.length; i++) {
            if(participants[i].username !== username){
                return participants[i].username;
            }
        }
        return participants[0].username;
    }
 
    render(){
        const { matches, history } = this.props;
        return(
            <div className={styles["container"]}>
                <div className={styles["title"]}>Matches</div>

                {matches.map((match) => 
                    <div className={styles["match"]} onClick={() => match.onGoing && history.push(`match/${match.matchId}`)} key={match.matchId}>
                        match with: {this.getUsername(match.participants)}
                        {match.winner !== undefined ? <div> winner: {match.winner.username}</div>: <div>still going </div> }
                        </div> )}
            </div>
        )
    }
}
export default Matches;