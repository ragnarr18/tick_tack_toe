import React from 'react';
import { compose } from 'redux';
import {connect} from 'react-redux';
import { addSession } from '../../Actions/sessionActions';

//returns a function withAuth
const noAuth = (OriginalComponent) => {
    class NewComponent extends React.Component {
        componentDidMount(){
            const sId = localStorage.getItem('s.id');
            const uId = localStorage.getItem('u.id');
            const username = localStorage.getItem('u.name');
            //redirect if no session in place
            if(sId !== null){
                const { socket, addSession, history } = this.props;
                socket.auth={username: username, sessionID: sId, userID: uId }
                socket.connect();
                socket.on('session', session => {
                    addSession(session);
                })
                history.replace("/dashboard")
            } 
        }
        render(){
            return <OriginalComponent {...this.props} />
        }
    }
    return NewComponent;
}

// const withAuthHoc = compose(
//     connect(), withAuth
// )

// export default withAuthHoc;
const mapStateToProps = ({ socket, session }) => ({ socket, session });

const cmposedAuth = compose(
    connect(mapStateToProps, { addSession }),noAuth
)
export default cmposedAuth;
// export default connect(mapStateToProps)(withAuth);
// export default withAuth;