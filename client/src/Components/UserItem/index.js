import React from 'react';
import UserModal from '../Modal';
import styles from './styles.module.css';

class UserItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    challenge(){
        const { challenge } = this.props;
        this.openModal(false);
        challenge();
    }
    
    openModal(status){
        const { user } = this.props;
        if(user.connected){
            this.setState({isOpen: status})
        }
    }
 
    render(){
        const { user } = this.props;
        //make the curser a pointer
        return(
            <div>
                <div onClick={() => this.openModal(true)} className={styles["user"]} >
                    <div className={styles["name"]} >{user.username}</div>
                     {user.connected === true 
                    ? <div className={styles["status"]} > <i className="fa fa-circle" style={{color: 'lightgreen'}}  > online</i> </div> 
                    : <div className={styles["status"] } ><i className="fa fa-circle" style={{color: 'darkred'}} > offline</i></div>} 
                    </div>
                <UserModal isOpen={this.state.isOpen} closeModel={() => this.openModal(false)} >
                    <div>Would you like to play a game with user {user.username}?</div>
                    <button onClick={() => this.challenge()}>Play match</button>
                </UserModal>
            </div>
        )
    }
}
// const mapStateToProps = ({ matchs, socket, session }) => ({ matchs, socket, session });

export default UserItem;
// export default withAuth(connect(mapStateToProps, { getmatchs, addSession })(Users));


// export default connect(mapStateToProps, { getmatchs, addSession })(withAuth(Users));
// export default connect(mapStateToProps, { getmatchs, addSession })(withAuth(Users));