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
            matches: [],
            challengeDeclined: false,
        }
    }

    componentDidMount(){
        console.log("mount: ",this.props);
        const { socket, history } = this.props;
        socket.emit('users');
        socket.on('users', users => {
            this.setState({users: users})
        })

        socket.on('connected_user', user => {
            let index = this.state.users.findIndex(u => u.userID === user.userID);
            console.log("connected: ", user, index);
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
        socket.on('matches', matches => {
            console.log("matches: ", matches);
            this.setState({matches: matches.filter((m) => this.matchContainsUser(m))})
        })

        socket.on('new_match', match => {
            console.log("new match!: ", match);
            if(this.matchContainsUser(match)){
                this.setState({ matches: [...this.state.matches, match]})
            }
        })

        socket.on('game_challenge_declined', (fromUser) => {
            console.log("declined sorry");
            this.setState({challengeDeclined: true})
            
        })

        socket.on('game_challenge_accepted', (matchId, fromUser) => {
            console.log("push");
            history.push(`match/${matchId}`);
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
        console.log("unmount, ",this.props);
    }

    matchContainsUser(match){
        const { session } = this.props;
        const {username } = session;
        if(match.participants[0].username === username || match.participants[1].username === username ){
            return true;
        }
        return false;
    }
    
    render(){
        const { users, matches, challengeDeclined } = this.state;
        const { session, history } = this.props;
        const { username } = session;
        return(
            <div className={styles["container"]}>
                {/* <div>DASHBOARD!</div> */}
                <Users users={users} username={username} history={history} />
                <Matches matches={matches} username={username}  history={history} />
                {challengeDeclined &&
                    <UserModal isOpen={this.state.challengeDeclined} closeModel={() => this.setState({challengeDeclined: !challengeDeclined})} >
                    <div>Challenge was declined</div>
                    </UserModal>}
            </div>
        )
    }
}
export default withAuth(Dashboard);