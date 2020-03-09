import logo from './logo.svg';
import React, { useReducer } from 'react';
import './App.css';
import axios from 'axios';


class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      users : []
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    axios.get('http://localhost:3000/users/').then(response => {
      console.log(response);
      this.setState({ users: response.data })
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className='button' onClick={this.handleClick} />
          <UsersList users={this.state.users}/>
        </header>
      </div>
    );
  }
}

function UsersList(props) {
  return (
    <div>
      {props.users.map(c => <User name={c.username} level={c.level} key={c._id}/> )}
    </div>
  );
}

function User(props){
  return (
    <div className='user' onClick={() => alert('click')}>
      {'User: ' + props.name + ' Level: ' + props.level}
    </div>
  );
}

class MessageApp extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if(!this.state.text.length){
      return;
    }
    const newMessage = {
      text: this.state.text,
    };
    axios.post('http://localhost:3000/conversations/5e66c1b31f3a688cd09aa4b2', newMessage)
    .catch(err => {
      console.log(err);
    });
  }

  handleClick() {
    axios.get('http://localhost:3000/conversations/5e66c1b31f3a688cd09aa4b2').then(response => {
        console.log('Retrieved data');
        console.log(response);
        this.setState({messages: response.data});

    })
    .catch(err => {
      console.log(err);
    });

  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className='button' value='load_msgs' onClick={this.handleClick} />
          <MessagesList messages={this.state.messages}/>
          <input
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button value='send' onClick={this.handleSubmit}></button>
        </header>
      </div>
    );
  }

}

function Message(props) {
  return (
    <div className='message' onClick={() => alert('click')}>
      {'> ' + props.text}
    </div>
  );
}

function MessagesList(props){
  return (
    <div>
      {props.messages.map(c => <Message text={c.text} key={c._id}/> )}
    </div>
  );
}


export {App, MessageApp};
