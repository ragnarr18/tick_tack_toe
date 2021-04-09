import React from 'react';
import noAuth from '../NonAuthorization';


class Welcome extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            signinOK: true,
            loading: false,
            errorMsg: "",
        }
    }

    async componentDidMount(){
        console.log("welcome", this.props);
        const { socket, history, addSession } = this.props;
        socket.on('session', session => {
            console.log("adding session welcome didmount");
            addSession(session);
            history.push("/dashboard")
        })
        socket.on('connect_error', error =>{
            console.log("er: ", error);
            if(error.message === "invalid username"){
                this.setState({signinOK: false, errorMsg: error.message })
            }
            else{
                this.setState({signinOK: false, errorMsg: "username is " + error.message })
            }
            console.log("state: ", this.state);
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        console.log("unmount. welcome");
        socket.off('session');
        socket.off('connect_error')
    }

    //helper function
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
 
    async signin(){
        this.setState({ loading: true})
        console.log("signing: ,",this.props);
        const { socket } = this.props;
        const { username } = this.state;
        socket.auth = {username: username};
        socket.connect();
        await this.sleep(2000)
        console.log("after connect: ", this.state);
        if(this.state.signinOK){
            console.log("try to connect");
            this.setState({loading: false})
        }
        else{
            console.log("still running");
            this.setState({loading: false})

        }
        
    }
    
    render(){
        const { username, signinOK, loading, errorMsg } = this.state;
        console.log(username, signinOK, loading);
        return(
            <div>
                <div>Welcome my friend!</div>
                <label htmlFor="">Username:</label>
                <input type="text" value={username} onChange={(e) => this.setState({username: e.target.value})} />
                <input type="submit" onClick={() => this.signin()}/>
                {/* {loading ===false && signinOK === false? <div></div>: <div>not ok</div> } */}
                {errorMsg !== "" && loading=== false ? <div>{errorMsg}</div> : <div></div> }
                {loading ===true ? <div>loading</div> : <div></div> } 
            </div>
        )
    }
}
// const mapStateToProps = ({ users, socket }) => ({ users, socket });

// export default nonAuth(connect(mapStateToProps, { getUsers, addSession })(Welcome));
export default noAuth(Welcome);