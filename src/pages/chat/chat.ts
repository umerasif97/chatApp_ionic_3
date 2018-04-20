import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import * as _ from "lodash";
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';  

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
  user = { id: '', email: '', username: '' };
  // fromMessages = [];
  // toMessages = [];
  allRoomArray = [];
  allRoom = {};
  room = [];
  msgs = [{ msgId: '', text_data: '', time: '', from: '', to: '' }];
  infoRoom;
  newMessage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {
    this.users = db.list('/users');
    this.user.id = this.navParams.get('id');
    this.user.email = this.navParams.get('email');
    this.user.username = this.navParams.get('username');

    let self = this;
    this.infoRoom = firebase.database().ref('/rooms').on('value', function (snapshot) {
      self.allRoom = snapshot.val();
      //console.log(self.allRoom)
      for (var key in self.allRoom) {
        self.allRoom[key]['key'] = key;
        self.allRoomArray.push(self.allRoom[key])
        if (self.allRoom[key].user1 == self.user.email || self.allRoom[key].user1 == firebase.auth().currentUser.email && self.allRoom[key].user2 == self.user.email || self.allRoom[key].user2 == firebase.auth().currentUser.email) {
          self.room.push(self.allRoom[key])
        }
      }
      // console.log(self.allRoomArray);
    });
    console.log(self.room);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }

  back() {
    this.navCtrl.setRoot(HomePage);
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

  sendMessage(user_email) {

    this.msgs = [{ msgId: this.guid(), text_data: this.newMessage, time: Date(), from: firebase.auth().currentUser.email, to: user_email }];
    if (this.allRoomArray.length > 0) {
      let a = _.findIndex(this.allRoomArray, function (o) {
        return ((firebase.auth().currentUser.email == o.user1 || firebase.auth().currentUser.email == o.user2) && (user_email == o.user1 || user_email == o.user2))
      });
      if (a > -1) {
        this.db.list('/rooms/' + this.allRoomArray[a].key + '/msgs').push({
          msgId: this.guid(),
          text_data: this.newMessage,
          time: Date(),
          from: firebase.auth().currentUser.email,
          to: user_email
        });
      } else {
        this.db.list('/rooms').push({
          id: this.guid(),
          user1: firebase.auth().currentUser.email,
          user2: user_email,
          msgs: this.msgs
        });
      }
    } else {
      this.db.list('/rooms').push({
        id: this.guid(),
        user1: firebase.auth().currentUser.email,
        user2: user_email,
        msgs: this.msgs
      });
    }
    this.newMessage = '';
  }
}
