import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import * as _ from "lodash";
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { LoginProvider } from '../../providers/login/login';

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
  providers: [LoginProvider]
})
export class ChatPage {

  users: FirebaseListObservable<any[]>;
  user = { id: '', email: '', username: '' };
  // fromMessages = [];
  // toMessages = [];
  allRoomArray = [];
  allRoom = {};
  room;
  roomMsgs = [];
  msgs = [{ msgId: '', text_data: '', time: '', from: '', to: '' }];
  infoRoom;
  newMessage;
  key;
  currentUser = firebase.auth().currentUser.email;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public loginService: LoginProvider) {
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
        self.allRoomArray.push(self.allRoom[key]);
        if (self.user.email == self.allRoom[key].user1 && self.currentUser == self.allRoom[key].user2 || self.user.email == self.allRoom[key].user2 && self.currentUser == self.allRoom[key].user1) {
          self.room = self.allRoom[key].msgs;
        }
      }
      //console.log(self.allRoomArray);
    });
    //console.log(self.room);
  }

  ionViewDidLoad() {
    //console.log(this.currentUser);
    //console.log('ionViewDidLoad ChatPage');
  }

  logout() {
    this.loginService.logout();
  }

  back() {
    this.navCtrl.setRoot(HomePage);
  }

  // updateStatus(status: string){
  //   this.db.object('/users' + this.user.key).update({
  //     status: status
  //   })
  // }

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
    //let k = 3;
    let self = this;
    self.msgs = [{ msgId: self.guid(), text_data: self.newMessage, time: Date(), from: self.currentUser, to: user_email }];
    if (self.allRoomArray.length > 0) {
      let a = _.findIndex(self.allRoomArray, function (o) {
        return ((self.currentUser == o.user1 || self.currentUser == o.user2) && (user_email == o.user1 || user_email == o.user2))
      });
      if (a > -1) {
        let abc = Object.keys(self.room);
        let k = abc.length;
        //console.log(abc.length)
        self.db.list('/rooms/' + self.allRoomArray[a].key + '/msgs').set(k.toString(), {
          msgId: self.guid(),
          text_data: self.newMessage,
          time: Date(),
          from: self.currentUser,
          to: user_email
        });
      } else {
        self.db.list('/rooms').push({
          id: self.guid(),
          user1: self.currentUser,
          user2: user_email,
          msgs: self.msgs
        });
      }
    } else {
      self.db.list('/rooms').push({
        id: self.guid(),
        user1: self.currentUser,
        user2: user_email,
        msgs: self.msgs
      });
    }
    self.newMessage = '';
  }
}
