import React from 'react';
import { connect } from 'react-redux';
import {removeSession} from '../../Actions/sessionActions';
import styles from './styles.module.css';


class Nav extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }
 
    leave(){
        const { socket, history, removeSession } = this.props;
        socket.emit('leave');
        socket.disconnect();
        removeSession();
        history.replace("/");
    }
    
    render(){
        // const { socket.auth.username } = this.props;
        return(
            <div className={styles["container"]} >
                <div className={styles["username"]}>{this.props.socket.auth.username}</div>
                <input className={styles["leave"]} type="button" value="LEAVE" onClick={() => this.leave()}/> 
            </div>
        )
    }
}
const mapStateToProps = ({ socket }) => ({ socket });

export default connect(mapStateToProps, { removeSession })(Nav);