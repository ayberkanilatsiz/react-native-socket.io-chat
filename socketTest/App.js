import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import SocketIOClient from 'socket.io-client';


export default class App extends Component<{}> {

  constructor(props){
    super(props)

    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.onSend = this.onSend.bind(this);
    this.renderUsernameView = this.renderUsernameView.bind(this);
    this.start = this.start.bind(this);
  
    this.state={
      messages:[],
      userId:null,
      username:null,
      isReady:false,
    }

    this.socket = SocketIOClient('http://192.168.1.183:3000'); //This should be your ip or local 
    this.socket.on('messages', this.onReceivedMessage);
    this.socket.on('userId', this.getUserId);
  }

  getUserId(data){
    const { userId } = data;

    this.setState({userId});
  }

  onReceivedMessage(mes){
    const arrMes = [{...mes.messages}];
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, arrMes),
    }));
  }

  onSend(messages){
    const mes = messages[0];
    const { username } = this.state;
    mes['username'] = username;
    this.socket.emit('messages',mes)
  }

  start(){
    const { username } = this.state;
    if(username && username.length > 3){
      this.setState({isReady:true});
    }else{
      alert('Username is min 4 characters')
    }
  }

  renderUsernameView(){
    return(
      <View style={ styles.container }>
        <View style={ styles.textInputContainer }>
          <TextInput
            style={styles.textInput}
            placeholder={'Username'}
            onChangeText={(username) => this.setState({username})}
            underlineColorAndroid={'transparent'}
            value={this.state.text}
          />
        </View>
        <TouchableOpacity onPress={ this.start } style={styles.button}>
          <Text style={ styles.buttonText }>
            Let's Start!
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { userId, isReady } = this.state;
    if(!isReady){
      return this.renderUsernameView();
    }
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        onPressAvatar={ (user)=> alert(user.name)}
        user={{
          _id: userId,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput:{
    height:50,
    alignSelf:'stretch',
    textAlign:'center',
  },
  textInputContainer:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'rgba(0,0,0,0.2)',
    alignSelf:'stretch',
    marginHorizontal:40,
  },
  button:{
    alignSelf:'stretch',
    height:50,
    marginTop:40,
    marginBottom:40,
    marginHorizontal:50,
    backgroundColor:'#778DA9',
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  buttonText:{
    color:'white',
    fontWeight:'400',
    fontSize:18,
  }
});
