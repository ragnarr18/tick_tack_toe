import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {addSession} from '../../Actions/sessionActions';
import {getSession} from '../../Actions/sessionActions';
import {removeSession} from '../../Actions/sessionActions';
import {getCurrentMatch, setAllMatches} from '../../Actions/matchActions';
import Nav from '../Nav';

//returns a function withAuth
const withAuth = (OriginalComponent) => {
    class NewComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                render: false,
            }
        }
        
        async componentDidMount(){
            const { socket,addSession, getSession, getCurrentMatch, setAllMatches, matchState } = this.props;
            await getSession();
            const { session } = this.props
            const { username, userID, sessionID } = session;
            socket.on('session',  session => {
                addSession(session);
            })
            const { history, match } = this.props;
            
            //redirect if no session in place
            if(sessionID === null && match.path === "/dashboard"){
                history.replace("/");
            }

            //setup connection
            else{
                const { socket, addSession} = this.props;
                socket.auth={username: username, sessionID: sessionID, userID: userID }
                socket.connect();
                socket.on('session', session => {
                    addSession(session);
                })
                this.setState({render: true})
            }

        // socket.emit('matches');
        // socket.on('matches', async matches => {
        //     await setAllMatches(matches.filter((m) => this.matchContainsUser(m)));
        //     // this.setState({matches: matches.filter((m) => this.matchContainsUser(m))})
        // })

        // if(match.params.matchId){
        //     await getCurrentMatch(match.params.matchId);
        // }

        // socket.on('new_match', async match => {
        //     if(this.matchContainsUser(match)){
        //         await setAllMatches([...matchState.matches, match]);
        //         // await getCurrentMatch(match.matchId);
        //     }
        // })
        }
    
        componentWillUnmount(){
            const { socket } = this.props;
            socket.off('session');            
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
            if(!this.state.render){
                return ( <React.Fragment></React.Fragment> )
            }
            else{
                return(<React.Fragment> 
                    <Nav {...this.props} /> 
                    {/* <Nav />  */}
                    <OriginalComponent {...this.props} /> 
                    {/* <OriginalComponent  history ={this.props.history}/>  */}
                </React.Fragment>
                )
            }
        }
    }
    return NewComponent;
}

// const withAuthHoc = compose(
//     connect(), withAuth
// )

// export default withAuthHoc;
const mapStateToProps = ({ socket, session, matchState }) => ({ socket, session, matchState });

const cmposedAuth = compose(
    connect(mapStateToProps, { addSession, getSession, removeSession, setAllMatches }),withAuth
)
export default cmposedAuth;
// export default connect(mapStateToProps)(withAuth);
// export default withAuth;