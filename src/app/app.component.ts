import { Welcome } from './../pages/welcome/welcome';
import { UserService } from '../services/user-service';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { AngularFire } from 'angularfire2';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Login;

  constructor(platform: Platform, af: AngularFire, statusBar: StatusBar, splashScreen: SplashScreen, userService: UserService) {
    let authObserver = af.auth.subscribe( user => {
      if (user) {
        userService.setUser(user).then(( ) => {
          userService.getUser(user.uid).subscribe((appUser ) => {
            userService.getSubscription(user.uid).subscribe((subscription ) => {
              appUser.subscription = subscription;
              userService.user = appUser;
              if (subscription) {
                this.rootPage = HomePage;
              }
              else {
                this.rootPage = Welcome;
              }
            })
          })
        })
      }
      else {
        this.rootPage = Login;
      }
     authObserver.unsubscribe();
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

