import './App.css';
import React from 'react';
import Welcome from './Components/Welcome/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Match from './Components/Match';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
  }
  
  render(){
    return (
      // <Provider store={createStore(reducers, applyMiddleware(thunk))}>
        <Router>
      <div className="App">
        <Switch>
          <Route exact path ="/" component={Welcome} />
          <Route exact path ="/dashboard" component={Dashboard} />
          <Route exact path ="/match/:matchId" component={Match} />
          
        </Switch>
      </div>
      </Router>
      // </Provider>
    );
  }
}

// const mapStateToProps = ({ socket }) => ({ socket });

// export default connect(mapStateToProps, {addSession })(App);

export default App;