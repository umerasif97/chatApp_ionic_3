import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import * as _ from "lodash";
import { LoginPage } from '../../pages/login/login';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  infoUser;
  allUser;
  allUserArray = [];

  constructor(public navCtrl: NavController,
    public db: AngularFireDatabase) {

  }

  updateStatus(email) {
    let self = this;
    this.infoUser = firebase.database().ref('/users').on('value', function (snapshot) {
      self.allUser = snapshot.val();
      //console.log(self.allRoom)
      for (var key in self.allUser) {
        self.allUser[key]['key'] = key;
        self.allUserArray.push(self.allUser[key])
        }
        if(self.allUser[key].email == email){
          localStorage.setItem('key', self.allUser[key].key);
          self.db.object('/users/' + self.allUser[key].key).update({
            status: true
          });
      }
    //   if (self.allUserArray.length > 0) {
    //     let a = _.findIndex(self.allUserArray, function (o) {
    //       if (o.email == email) {
    //         localStorage.setItem('key', o.key);
    //         self.db.object('/users/' + o.key).update({
    //           status: true
    //         });
    //       }
    //     });
    //   }
     });
  }  

  logout() {
    this.db.object('/users/' + localStorage.getItem('key')).update({
      status: false
    });
    localStorage.clear(); 
    this.navCtrl.setRoot(LoginPage);
  }
}
