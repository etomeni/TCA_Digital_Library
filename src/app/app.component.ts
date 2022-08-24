import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import {SplashScreen} from '@capacitor/splash-screen';
import { Location } from '@angular/common';

import { Network } from '@capacitor/network';

// Changes made to run firebase auth on ios simulator
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { StorageService } from './services/storage.service';
import { interval } from 'rxjs';
import { LiveRadioService } from './services/live-radio.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private StorageService: StorageService,
    private location: Location,
    private alertController: AlertController,
    private platform: Platform,
    private toastController: ToastController,
    private radioService: LiveRadioService,
  ) 
  {
    this.initializeApp();

    // Changes made to run firebase auth on ios simulator
    const appi = initializeApp(environment.firebaseConfig);
    if (Capacitor.isNativePlatform) {
      initializeAuth(appi, {
        persistence: indexedDBLocalPersistence
      });
    }
  }

  async ngOnInit() {

    this.platform.ready().then(async () => {
      setTimeout(()=>{
        SplashScreen.hide();
      }, 3000);

      const startNetStatus = await Network.getStatus();
      let disconnected = false;
      if (!startNetStatus.connected || disconnected) {
        interval(20000).subscribe((func => {
          // console.log('Internet Connection is disconnected :-(');
          this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
        }));
      }
      Network.addListener('networkStatusChange', status => {
        // console.log('Network status changed', status);
        if (status.connected) {
          if (!startNetStatus.connected || disconnected) {
            disconnected = false;
            // console.log('Internet Connection Restored!');
            this.radioService.TCARadio.load();
            if ((this.location.isCurrentPathEqualTo('/radio') || this.location.isCurrentPathEqualTo('/inframe-radio')) && this.radioService.TCARadio.readyState > 1) {
              this.radioService.playRadio();
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
      
      // const logCurrentNetworkStatus = async () => {
        // const status = await Network.getStatus();
      
        // console.log('Network status:', status);
      // };

    });

    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

    this.StorageService.removeItem("playing");
    this.StorageService.removeItem("outsidePodcast");
    this.StorageService.removeItem("outsideShow");
    this.StorageService.removeItem("outsideRadio");
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

}
