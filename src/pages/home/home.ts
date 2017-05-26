import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { Login } from '../login/login';
import { ItemToto } from '../itemToto/itemToto';
import { AddToto } from '../add-toto/add-toto';
import { ItemSpecial } from '../item-special/item-special';
import { AddSpecial } from '../add-special/add-special';
import { LoadingController } from 'ionic-angular';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  allItems= [];
  items = [];
  loading: any;
  gambleOpen: boolean = true;
  currentDate;
  gambleSelect: string = "mygambles";

  constructor(public navCtrl: NavController,af: AngularFire,private _auth: AuthService,public loadingCtrl: LoadingController) {
     this.loading = this.loadingCtrl.create({
            content: "Please wait...",
        });
     this.loading.present();
      af.database.list('/dnb/gambles').subscribe(result => {
        this.items.length = 0;
        this.allItems.length = 0;
        result.forEach(element => {
          this.items.push(element);
          this.allItems.push(element);
        });
        if (result) {
          this.loading.dismiss();
        }
     });
    this.currentDate = moment().format('x');

  }

  showMyGambles () {
    this.items.length = 0;
     this.allItems.forEach(element => {
        this.items.push(element);  
     });   
  }

  showStats () {
     this.items.length = 0;
     this.allItems.forEach(element => {
       if (moment() > moment(element.closedForGamble)) {
         this.items.push(element);  
       }
     });   
  }

 goToItem(item: any)
  {
    if (item.type=="toto") {
     this.navCtrl.push(ItemToto, {
       item: item
     });
    } 
    if (item.type=="special") {
     this.navCtrl.push(ItemSpecial, {
       item: item
     });
    } 
  }

  addSpecial (item: any) {
    this.navCtrl.push(AddSpecial, {
       item: item
     });
  }

  addToto (item: any) {
    this.navCtrl.push(AddToto, {
       item: item
     });
  }
  // signInWithFacebook(): void {
  //   this._auth.signInWithFacebook()
  //     .then(() => this.onSignInSuccess());
  // }

  logOut(af: AngularFire): void {
    this._auth.signOut()
      .then( success => {
          this.navCtrl.push(Login);
      })
  }

  // private onSignInSuccess(): void {
  //   console.log("Facebook display name ",this._auth.displayName());
  // }

}
