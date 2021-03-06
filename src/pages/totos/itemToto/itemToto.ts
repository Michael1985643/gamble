import { UserService } from './../../../services/user-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { LoadingController } from 'ionic-angular';
import moment from 'moment';
import { AlertController } from 'ionic-angular';

//Pages
import { TotoOverview } from '../toto-overview/toto-overview';

//services
import { TotoService } from '../../../services/toto-service';
import { WedstrijdService } from '../../../services/wedstrijd-service';

@Component({
  selector: 'page-itemToto',
  templateUrl: 'itemToto.html'
})
export class ItemToto {
  items= [];
  loading: any;
  item;
  user;
  currentDate = moment().format('x');
  closedForGamble;
  nickName: string;

  constructor(
    public alertCtrl: AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private af: AngularFire,
    private _auth: AuthService,
    public loadingCtrl: LoadingController,
    public totoService: TotoService,
    public wedstrijdService: WedstrijdService,
    public userService: UserService) 
    {
      this.user = _auth.auth$.getAuth().auth;
      this.item = this.navParams.get('item');
      this.closedForGamble = this.item.closedForGamble;
      if (this.navParams.get('nickName')) { //LOAD FROM TOTO OVERVIEW PER USER
        this.nickName = this.navParams.get('nickName');
        userService.getAllPlayers(this.userService.user.subscription).subscribe((players ) => {
          players.forEach(player => {
            if (player.nickName == this.navParams.get('nickName')) {
              this.getWedstrijdenAndRelateToPlayerGamble(player.$key);
            }
          });
        })
      }
      else { //load default from home
        this.getWedstrijdenAndRelateToPlayerGamble(this.user.uid);
      }
    }

  private getWedstrijdenAndRelateToPlayerGamble (uid) {
    var items =[];
    this.wedstrijdService.getWedstrijden(this.item.linked, this.item.linkedId).subscribe((wedstrijden ) => {
      this.totoService.getPlayerGamble(this.item.id, uid).subscribe((playerGamble ) => {
        for (var key in wedstrijden) {
          playerGamble.forEach(playerObject => {
              if (playerObject.$key == key) {
                wedstrijden[key].selectedItem = playerObject.$value;
              }
          })
          items.push(wedstrijden[key])
        };
        this.items = items;
      })
    })
  }

  private isComplete(item) {
    if (parseInt(item.goalsHomeTeam) >= 0 && parseInt(item.goalsAwayTeam) >= 0) {
      return true
    }
    else { 
      return false 
    }
  }

  private itemClicked(item, toto) {
    if (moment() > moment(this.item.closedForGamble)) {
      this.showAlertIsClosed();
      return
    }

    if (toto == item.selectedItem) {
      item.selectedItem = "";
      this.totoService.removePlayerToto(this.item.id ,this.user.uid, item.id);
    }
    else 
    {
      item.selectedItem = toto;
      this.totoService.setPlayerToto(this.item.id ,this.user.uid, item.id, toto);
        //items.set(firebase.database.ServerValue.TIMESTAMP);
        //timestamp = https://www.epochconverter.com/ UTC
    }
  }

  private showAlertIsClosed() {
    let alert = this.alertCtrl.create({
      title: 'Gamble closed',
      subTitle: this.item.name + ' was closed on ' + moment(this.item.closedForGamble).format('dddd DD-MM-YYYY HH:mm:ss'),
      buttons: ['OK']
    });
    alert.present();
  }

  private overview()  {
    this.navCtrl.push(TotoOverview, {
       item: this.item
     });

  }
}
