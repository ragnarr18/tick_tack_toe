import React from 'react';

import styles from './styles.module.css';


class Nav extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }
 
    async leave(){
        const { socket, history, removeSession } = this.props;
        socket.emit('leave');
        socket.disconnect();
        await removeSession();
        history.replace("/");
    }
    
    render(){
        const { session } = this.props;
        return(
            <div className={styles["container"]} >
                <div className={styles["username"]}>{session.username}</div>
                <input className={styles["leave"]} type="button" value="LEAVE" onClick={() => this.leave()}/> 
            </div>
        )
    }
}
export default Nav;