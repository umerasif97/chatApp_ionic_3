import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated/';

import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChatPage } from '../pages/chat/chat';

  var config = {
    apiKey: "AIzaSyChqoA_jQ1ZivRCIZUkzPqamiT2TJitwjA",
    authDomain: "chatapp-2e661.firebaseapp.com",
    databaseURL: "https://chatapp-2e661.firebaseio.com",
    projectId: "chatapp-2e661",
    storageBucket: "chatapp-2e661.appspot.com",
    messagingSenderId: "599503822826"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
