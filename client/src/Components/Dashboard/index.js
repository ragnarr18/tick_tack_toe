import React from 'react';
import withAuth from '../Authorization';
import Users from '../Users';
import Matches from '../Matches';
import UserModal from '../Modal';
import styles from './styles.module.css';

class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            challengeDeclined: false,
            challengeAccepted: false,
        }
    }

    componentDidMount(){
        const { socket, history, setAllMatches ,matchState } = this.props;
        this.setState({matches: matchState.matches})
        socket.emit('users');
        socket.on('users', users => {
            this.setState({users: users})
        })

        socket.on('connected_user', user => {
            let index = this.state.users.findIndex(u => u.userID === user.userID);
            if(index >= 0){
                let copyUsers = [...this.state.users];
                let currentUser = {...copyUsers[index]};
                currentUser.connected = true;
                copyUsers[index] = currentUser;
                this.setState({ users: copyUsers })
            }
            else{
                this.setState({ users: [ ...this.state.users, user]})
            }
        })

        socket.on('disconnected_user', userID => {
            let index = this.state.users.findIndex(u => u.userID === userID);
            let copyUsers = [...this.state.users];
            let currentUser = {...copyUsers[index]};
            currentUser.connected = false;
            copyUsers[index] = currentUser;
            this.setState({ users: copyUsers })
        })

        socket.on('user_left', userID => {
            this.setState({ users: this.state.users.filter(u => u.userID !== userID) })
        })

        socket.emit('matches');
        socket.on('matches', async matches => {
            console.log("the matches: ", matches);
            await setAllMatches(matches);
        })

        socket.on('new_match', async match => {
                console.log([...matchState.matches, match]);
                await setAllMatches([...matchState.matches, match]);
        })

        socket.on('game_challenge_declined', (fromUser) => {
            this.setState({challengeDeclined: true})
            
        })

        socket.on('game_challenge_accepted', async(matchId, fromUser) => {
            this.setState({challengeAccepted: true})
            await this.sleep(2000);
            history.push(`match/${matchId}`);
        })

        socket.on('match_ended', (matchID)=>{
            socket.emit('matches');
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        socket.off('user');
        socket.off('connected_user');
        socket.off('disconnected_user');
        socket.off('game_challenge_accepted');
        socket.off('new_match');
        socket.off('user_left');
        socket.off('matches');
        socket.off('session');
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    
    render(){
        const { users, challengeDeclined, challengeAccepted } = this.state;
        const { session, history, matchState } = this.props;
        const { username } = session;
        return(
            <div className={styles["container"]}>
                <Users users={users} username={username} history={history} />
                <Matches matches={matchState.matches} username={username}  history={history} />
                {challengeDeclined &&
                    <UserModal isOpen={this.state.challengeDeclined} closeModel={() => this.setState({challengeDeclined: !challengeDeclined})} >
                    <div>Challenge was declined</div>
                    </UserModal>}
                {challengeAccepted &&
                <UserModal isOpen={this.state.challengeAccepted} closeModel={() => this.setState({challengeAccepted: !challengeAccepted})} >
                <div>Challenge was accepted you will be redirected shortly, have fun!</div>
                </UserModal>}
            </div>
        )
    }
}
export default withAuth(Dashboard);