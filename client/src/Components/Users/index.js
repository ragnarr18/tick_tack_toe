import React from 'react';
import UserItem from '../UserItem';
import {connect } from 'react-redux';
import { v4 as uuid } from 'uuid';
import UserModal from '../Modal';
import styles from './styles.module.css';

class Users extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            challenges: [],
        }
    }

    componentDidMount(){
        const { socket } = this.props;
        socket.on('game_challenge', challenge => {
            const { challenger } = challenge;
            let index = this.state.challenges.findIndex(c => c.userID === challenger.userID);
            if(index < 0){
                this.setState({ challenges: [...this.state.challenges, challenger] })
            }
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        socket.off('game_challenge');
    }
    
    challenge(userID){
        const { socket } = this.props;
        socket.emit('game_challenge', userID);
    }

    accept(accept, userID){
        const { socket, history } = this.props;
        const matchID = uuid();
        this.setState({challenges: this.state.challenges.filter(c => c.userID !== userID)})
        if(accept){
            socket.emit('game_challenge_accepted', matchID, userID);
            history.push(`match/${matchID}`);
            return;
        }
        socket.emit('game_challenge_declined', (userID));
        return;
    }

    compare(a,b){
        if(a.connected > b.connected){
            return -1;
        }
        if(a.connected < b.connected){
            return 1;
        }
        
        if(a.username > b.username){
            return 1;
        }
        if(a.username < b.username){
            return -1;
        }
    }

    render(){
        const { users, username } = this.props;
        const { challenges } = this.state;
        console.log("users: ", users);
        users.sort((a, b) => this.compare(a,b))
        //sort by online then username
        
        return(
            <div className={styles["container"]}>
                <div className={styles["title"]}>Users</div>
                {users.map((user) => 
                    user.username !== username ? <UserItem key={user.userID} user={user} challenge={() => this.challenge(user.userID)}/> : <React.Fragment key={user.userID}></React.Fragment> )}
                {challenges.map((challenge) =>
                    <UserModal closeModel={() => this.accept(false, challenge.userID)} key={challenge.userID}>a challenge from {challenge.username} 
                    <button onClick={() => this.accept(true, challenge.userID)}>accept</button> <button onClick={() => this.accept(false, challenge.userID)}>decline</button>  
                    </UserModal>)}
            </div>
        )
    }
}
const mapStateToProps = ({ socket, session }) => ({ socket, session });

// export default Users;
// export default withAuth(connect(mapStateToProps, { getmatchs, addSession })(Users));

export default connect(mapStateToProps)(Users);
// export default connect(mapStateToProps, { getmatchs, addSession })(withAuth(Users));