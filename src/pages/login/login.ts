import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class User {
  email: string;
  password: string;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth, Facebook]
})
export class LoginPage {

  public user:User = new User();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public fAuth: AngularFireAuth,
              public facebook: Facebook,
              public alertCtrl: AlertController){
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

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