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
  infoRoom;
  newMessage;
  list = [];

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
      //console.log(self.allMessages);
      for (var key in self.allRoom) {
        self.allRoom[key]['key'] = key;
        self.allRoomArray.push(self.allRoom[key])
        if (self.allRoom[key].to == self.user.email && self.allRoom[key].from || firebase.auth().currentUser.email && self.allRoom[key].to == firebase.auth().currentUser.email && self.allRoom[key].from == self.user.email) {
          self.room.push(self.allRoom[key].msgs)
        }
      }
      self.list = Object.keys(self.allRoom[key].msgs);
      console.log(self.list);
      console.log(self.room);
      //console.log(self.allMessagesArray);
    });
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

  sendMessage(to) {

    let msgs = [{ msgId: this.guid(), text_data: this.newMessage, time: Date(), from: firebase.auth().currentUser.email, to: to }];
    // console.log(this.allMessagesArray);
    let a = _.findIndex(this.allRoomArray, ['to', to]);
    console.log(a);
    if (a > -1) {
      this.db.list('/rooms/' + this.allRoomArray[a].key + '/msgs').push({
        msgId: this.guid(),
        text_data: this.newMessage,
        time: Date(),
        from: firebase.auth().currentUser.email,
        to: to
      });
    } else {
      this.db.list('/rooms').push({
        id: this.guid(),
        from: firebase.auth().currentUser.email,
        to: to,
        msgs: msgs
      })
    }
    this.newMessage = '';
  }
}

