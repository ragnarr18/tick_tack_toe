import React from 'react';
import styles from './styles.module.css';

class Matches extends React.Component{

    userIsParticipant(participants){
        const { username } = this.props;
        for (let i = 0; i < participants.length; i++) {
            if(participants[i].username === username){
                return true;
            }
        }
        return false
    }
 
    render(){
        const { matches, history } = this.props;
        console.log("render matches: ", matches);
        return(
            <div className={styles["container"]}>
                <div className={styles["title"]}>Matches</div>

                {matches.length > 0 && matches.map((match) => 
                    <div className={styles["match"]} onClick={() => match.isOngoing && this.userIsParticipant(match.participants) && history.push(`match/${match.matchId}`)} key={match.matchId}>
                        match between {match.participants[0].username} and {match.participants[1].username}
                        {match.winner !== undefined && <div> winner: {match.winner.username}</div>}
                        {match.isOngoing === true && <div>still going </div>}
                        {match.winner === undefined && match.isOngoing === false && <div>Draw: Nobody won</div> }
                        </div> )}
            </div>
        )
    }
}
export default Matches;