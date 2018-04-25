import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { HomePage } from '../home/home';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as _ from "lodash";
import { ChatPage } from '../chat/chat';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class User {
  id: string;
  email: string;
  password: string;
  username: string;
  imageURL;
  status: string;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth, Facebook, LoginProvider]
})
export class LoginPage {

  public user: User = new User();
  dbUser: FirebaseListObservable<any[]>;
  // infoUser;
  // allUser;
  // allUserArray = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fAuth: AngularFireAuth,
    public facebook: Facebook,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    public loginService: LoginProvider) {
    this.dbUser = db.list('/users');
    //this.updateStatus();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  // updateStatus(){
  //   let self = this;
  //   this.infoUser = firebase.database().ref('/users').on('value', function (snapshot) {
  //     self.allUser = snapshot.val();
  //     //console.log(self.allRoom)
  //     for (var key in self.allUser) {
  //       self.allUser[key]['key'] = key;
  //       self.allUserArray.push(self.allUser[key])
  //     }
  //     console.log(self.allUser[key].email);
  //     console.log(self.allUser[key].key);
  //     console.log(self.allUserArray);      
  //     console.log(self.allUser[key]);

  //   });
  //   // if(self.allUser[key].email == self.user.email){
  //   //   self.db.object('/users/' + self.allUser[key].key).update({
  //   //     status: true
  //   //   })
  //   // }
  // }

  async login() {
    try {
      var r = await this.fAuth.auth.signInWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      if (r) {
        let alert = this.alertCtrl.create({
          title: 'Successfully logged in!',
          buttons: ['OK']
        });
        this.loginService.updateStatus(this.user.email);
        //console.log("Successfully logged in!");
        alert.present();
        this.navCtrl.push(HomePage);
        //this.navCtrl.pop();
      }

    } catch (err) {
      let errAlert = this.alertCtrl.create({
        title: err,
        buttons: ['OK']
      });
      errAlert.present();
      //console.error(err);
    }
  }
}