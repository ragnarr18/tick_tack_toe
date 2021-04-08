import React from 'react';
import { compose } from 'redux';
import {connect} from 'react-redux';
import { addSession } from '../../Actions/sessionActions';
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
        
        componentDidMount(){
            console.log("component did moutn auth");
            const { socket, addSession } = this.props;
            socket.on('session',  session => {
                console.log("adding session auth didmount");
                addSession(session);
            })
            const sId = localStorage.getItem('s.id');
            const uId = localStorage.getItem('u.id');
            const username = localStorage.getItem('u.name');
            console.log("sid: ", sId);
            const { history, match } = this.props;
            
            //redirect if no session in place
            if(sId === null && match.path === "/dashboard"){
                console.log(this.props);
                history.replace("/");
            }

            //setup connection
            else{
                const { socket, addSession} = this.props;
                socket.auth={username: username, sessionID: sId, userID: uId }
                socket.connect();
                socket.on('session', session => {
                    console.log("adding session auth");
                    addSession(session);
                })
                this.setState({render: true})
            }
           
        }
        render(){
            console.log("auth: ", this.state);
            if(!this.state.render){
                return ( <React.Fragment></React.Fragment> )
            }
            else{
                return(<React.Fragment> 
                    <Nav {...this.props} /> 
                    <OriginalComponent {...this.props} /> 
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
const mapStateToProps = ({ socket, session }) => ({ socket, session });

const cmposedAuth = compose(
    connect(mapStateToProps, { addSession }),withAuth
)
export default cmposedAuth;
// export default connect(mapStateToProps)(withAuth);
// export default withAuth;