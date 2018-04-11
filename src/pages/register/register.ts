import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
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
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AngularFireAuth]
})
export class RegisterPage {

  public user:User = new User();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fAuth: AngularFireAuth,
              public alertCtrl: AlertController){
  }


  async register() {
    try {
      var r = await this.fAuth.auth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      if (r) {
        let basicAlert = this.alertCtrl.create({
          title: 'Successfully registered!',
          buttons: ['OK']
        });
        basicAlert.present();
        this.navCtrl.push(LoginPage);
      }

    } catch (err) {
      let basicAlert = this.alertCtrl.create({
        title: err,
        buttons: ['OK']
      });
      basicAlert.present();
    }
  }
} 