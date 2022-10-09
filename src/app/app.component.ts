import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Location } from '@angular/common';

import { Network } from '@capacitor/network';

// Changes made to run firebase auth on ios simulator
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { StorageService } from './services/storage.service';
// import { interval } from 'rxjs';
// import { LiveRadioService } from './services/live-radio.service';
// import { DatabaseService } from './services/database.service';
import { AudioPlayerService } from './services/audio-player.service';
import { UpdateService } from './services/update.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  settings = {
    showOfferingPage: true,
    update: {
      forceful: false,
      newVersion: 1,
      status: false
    }
  }

  constructor(
    private storage: Storage,
    private location: Location,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private storageService: StorageService,
    // private radioService: LiveRadioService,
    private audioService: AudioPlayerService,
    private databaseService: DatabaseService,
    private updateService: UpdateService
  ) 
  {
    this.initializeApp();

    // Changes made to run firebase auth on ios simulator
    // const appi = initializeApp(environment.firebaseConfig);
    // if (Capacitor.isNativePlatform) {
    //   initializeAuth(appi, {
    //     persistence: indexedDBLocalPersistence
    //   });
    // }
  }

  async ngOnInit() {
    this.getSettingsDetails();

    this.platform.ready().then(async () => {
      setTimeout(()=>{
        SplashScreen.hide();
      }, 3000);

      let intervals;
      const startNetStatus = await Network.getStatus();
      let disconnected = false;
      if (!startNetStatus.connected || disconnected) {
        intervals = setInterval(() => {
          // console.log ('Internet Connection is disconnected :-(');
          this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
        }, 20000);
      }

      Network.addListener('networkStatusChange', status => {
        // console.log('Network status changed', status);
        if (status.connected) {
          if (!startNetStatus.connected || disconnected) {
            clearInterval(intervals);

            disconnected = false;
            // console.log('Internet Connection Restored!');
            this.audioService.getRadio();
            if (this.location.isCurrentPathEqualTo('/radio') && this.audioService.TCARadio.readyState > 1) {
              this.audioService.play({type: 'radio', id: '0'});
            }
            this.presentToast("Internet Connection Restored." ,"Welcome back, you're now Online!");
          }
        }

        if (!status.connected) {
          disconnected = true;
          console.log('Internet Connection is disconnected :-(');
          this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
        }
      });

    });

    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }

  initializeApp() {
    // let lastBack = Date.now();
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      // console.log('Back press handler!');
      if (this.location.isCurrentPathEqualTo('/radio')) {
        // Show Exit Alert!
        this.exitAppConfirmation();
        processNextHandler();
      } else {
        // console.log('Navigate to back page');
        this.location.back();
      }
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Handler called to force close!');
      this.alertController.getTop().then(r => {
        if (r) {
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      })
    });

    this.platform.ready().then(() => {
        this.updateService.checkForUpdate();
      }
    );

  }
  
  async exitAppConfirmation () {
    const loading = await this.alertController.create({
      // header: headerTitle,
      message: "Are you sure you want to close this App?",
      cssClass: 'alert-class',
      buttons: [{
        text: "Cancel",
        role: 'cancel',
        handler: ()=> {
          this.alertController.dismiss();
        }
      },
      {
        text: "Close",
        handler: ()=> {
          navigator['app'].exitApp();
        }
      }]
    });
    loading.present();
  }

  async presentToast(header, message) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 10000, // 10 seconds
      position: 'top', // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

  getSettingsDetails() {

    this.databaseService.getRealtimeDBdata("settings").then(
      (res: any) => {
        // console.log(res);
        this.settings = res;
        this.storageService.store("settings", res);
      },
      (err: any) => {
        console.log(err);

        this.storageService.get("settings").then(
          (res: any) => {
            if (res) {
              this.settings = res;
            }
          }
        );
        
      }
    )
  }

}
