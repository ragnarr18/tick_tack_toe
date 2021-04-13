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
        const { socket, history, addSession } = this.props;
        socket.on('session', session => {
            addSession(session);
            history.push("/dashboard")
        })
        socket.on('connect_error', error =>{
            if(error.message === "invalid username"){
                this.setState({signinOK: false, errorMsg: error.message })
            }
            else{
                this.setState({signinOK: false, errorMsg: "username is " + error.message })
            }
        })
    }

    componentWillUnmount(){
        const { socket } = this.props;
        socket.off('session');
        socket.off('connect_error')
    }

    //helper function
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
 
    async signin(){
        this.setState({ loading: true})
        const { socket } = this.props;
        const { username } = this.state;
        socket.auth = {username: username};
        socket.connect();
        await this.sleep(2000)
        if(this.state.signinOK){
            this.setState({loading: false})
        }
        else{
            this.setState({loading: false})

        }
        
    }
    
    render(){
        const { username,  loading, errorMsg } = this.state;
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

export default noAuth(Welcome);