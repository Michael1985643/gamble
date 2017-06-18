//out of the box
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import moment from 'moment';

//pages
import { Login } from '../login/login';
import { Overview } from '../overview/overview';
import { ItemToto } from '../itemToto/itemToto';
import { AddToto } from '../add-toto/add-toto';
import { ItemSpecial } from '../item-special/item-special';
import { AddSpecial } from '../add-special/add-special';

//services
import { UserService } from '../../services/user-service';
import { TotoService } from '../../services/toto-service';
import { SpecialService } from '../../services/special-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items = [];
  loading: any;
  currentDate;
  isAdmin: FirebaseObjectObservable<any> ;

  order: string = 'closedForGamble';
  
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public af: AngularFire,
    private _auth: AuthService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams, 
    public userService: UserService,
    public totoService: TotoService,
    public SpecialService: SpecialService
    ) 
    {
      this.isAdmin = this.userService.isAdmin();
      this.loading = this.loadingCtrl.create({
              content: "Please wait...",
      });
      this.loading.present();

      this.totoService.getOpen().subscribe((totos ) => {
        this.SpecialService.getOpen().subscribe((specials ) => {
          this.items = totos.concat(specials);
        })
        this.loading.dismiss(); 
      })
      this.currentDate = moment().format('x');
    }

  showMyOpenGambles () {
    this.totoService.getOpen().subscribe((totos ) => {
      this.SpecialService.getOpen().subscribe((specials ) => {
        this.items = totos.concat(specials);
      })
    })
  }

  showMyClosedGambles () {
    this.totoService.getClosed().subscribe((totos ) => {
      this.SpecialService.getClosed().subscribe((specials ) => {
        this.items = totos.concat(specials);
      })
    })
  }

  removeItem(item: any) {
    if (this.userService.user.role === "admin") {
      let confirm = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (item.type === "toto") {
              this.totoService.remove(item.id);
            }
            if (item.type === "special") {
              this.SpecialService.remove(item.id);  
            }
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('No');
          }
        }
      ]
    });
    confirm.present();
    }
  }

  //NAVIGATION
  logOut(af: AngularFire): void {
    this._auth.signOut()
      .then( success => {
          this.navCtrl.push(Login);
      })
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

  overview()  {
    this.navCtrl.push(Overview);
  }
}
