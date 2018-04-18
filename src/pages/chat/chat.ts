import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import * as _ from "lodash";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  users: FirebaseListObservable<any[]>;
  user = {id: '',email: '', username: ''};
  fromMessages = [];
  allMessagesArray = [];
  allMessages = {};
  messages: FirebaseListObservable<any[]>;
  infoMessages;
  newMessage;
  msgs = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {
    this.users = db.list('/users');
    this.user.id = this.navParams.get('id');
    this.user.email = this.navParams.get('email');
    this.user.username = this.navParams.get('username');

    let self = this;
    this.infoMessages = firebase.database().ref('/rooms').on('value', function (snapshot) {
      self.allMessages = snapshot.val();
      console.log(self.allMessages);
      for (var key in self.allMessages) {
        self.allMessages[key]['key'] = key;
        self.allMessagesArray.push(self.allMessages[key])
        console.log(self.allMessages[key]);
      }
    });
  }

  ionViewDidLoad() {
    this.getMessages();
    console.log('ionViewDidLoad ChatPage');
  }

  getMessages(){
    for (var key in this.allMessages) {
      if(this.allMessages[key].to == this.user.email  && this.allMessages[key].from == firebase.auth().currentUser.email){
        this.allMessages[key]['key'] = key;
        this.fromMessages.push(this.allMessages[key])
        console.log(this.allMessages[key]);
      }
    }
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  sendMessage(to) {
    
    this.msgs = [{ msgId: this.guid() , text_data: this.newMessage, time: Date() }];
    // console.log(this.allMessagesArray);
    let a = _.findIndex(this.allMessagesArray, ['to', to]);
    console.log(a);
    if (a > -1) { 
      this.db.list('/rooms/' + this.allMessagesArray[a].key + '/msgs').push({
        msgId: this.guid(),
        text_data: this.newMessage,
        time: Date()
          });
    } else {
      this.db.list('/rooms').push({
        id: this.guid(),
        from: firebase.auth().currentUser.email,
        to: to,
        msgs: this.msgs
      })
    }
    this.newMessage = '';
  }
}

