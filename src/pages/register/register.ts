import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase/app';

/**
 * Generated class for the RegisterPage page.
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
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AngularFireAuth]
})
export class RegisterPage {

  public user:User = new User();
  dbUser: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fAuth: AngularFireAuth,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              private camera: Camera){
                this.dbUser = db.list('/users');
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

  takePhoto() {

    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      //      targetWidth: 1000,
      //      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
      this.user.imageURL = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });

  }


  accessGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.user.imageURL = 'data:image/jpeg;base64,' + imageData;
      console.log(this.user.imageURL);
    }, (err) => {
      // let errAlert = this.alertCtrl.create({
      //   title: err,
      //   buttons: ['OK']
      // });
      // errAlert.present();
      console.log(err);
    });
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
        this.dbUser.push({
          id: firebase.auth().currentUser.uid,
          email: this.user.email,
          username: this.user.username,
          image: this.user.imageURL,
          status: false
        })
        this.user.email = '';
        this.user.password = '';
        this.user.username = '';
        this.user.imageURL = '';
        this.navCtrl.pop();
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