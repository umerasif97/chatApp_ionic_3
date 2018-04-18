import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {  FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ChatPage } from '../chat/chat';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dbUser: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase) {
   this.dbUser = db.list('/users');
   //console.log(this.dbUser);
  }

  logout(){
    this.navCtrl.setRoot(LoginPage); 
  }

  chat(user){
    this.navCtrl.push(ChatPage ,{
      id: user.id,
      email: user.email,
      username: user.username
    });
  }
}
