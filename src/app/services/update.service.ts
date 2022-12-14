import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Capacitor, Plugins } from '@capacitor/core';
import { DatabaseService } from './database.service';

const { NativeMarket } = Plugins;

interface appUpdate {
  currentAppVersion: {
    iOS: string,
    android: string
  },
  status: boolean;
  forceful: boolean;
  displayText?: {
    title: string;
    message: string;
    btn: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  appUpdateDetails = {
    currentAppVersion: {
      iOS: '',
      android: ''
    },
    status: false,
    forceful: false,
    displayText: {
      title: "New Update",
      message: "Good news there is a new version",
      btn: "Update"
    }
  }

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private databaseService: DatabaseService,
    private storageService: StorageService,
    private appVersion: AppVersion,
    private inAppBrowser: InAppBrowser
  ) { }

  async checkForUpdate() {
    this.databaseService.getRealtimeDBdata("settings/update").then(
      async (res: appUpdate) => {
        this.appUpdateDetails.status = res.status;
        this.appUpdateDetails.currentAppVersion.iOS = res.currentAppVersion.iOS;
        this.appUpdateDetails.currentAppVersion.android = res.currentAppVersion.android;
        this.appUpdateDetails.forceful = res.forceful;
        // this.appUpdateDetails.displayText = res.displayText;
        this.appUpdateDetails.displayText.btn = res.displayText.btn;
        this.appUpdateDetails.displayText.message = res.displayText.message;
        this.appUpdateDetails.displayText.title = res.displayText.title;

        if (res.status) {
          const versionNumber = await this.appVersion.getVersionNumber();
          const userVersionNumber = Number(versionNumber.split(".").join(""));

          const iOSCurrentVersion = Number(res.currentAppVersion.iOS.split(".").join(""));
          const androidCurrentVersion = Number(res.currentAppVersion.android.split(".").join(""));
          // const devicePlatform = Capacitor.getPlatform();

          if (Capacitor.getPlatform() == "android") {
            if (iOSCurrentVersion > androidCurrentVersion) {
              this.presentUpdateAlert(
                res.displayText.title,
                res.displayText.message,
                res.displayText.btn,
                res.forceful
              );
            }
          }

          if (Capacitor.getPlatform() == "ios") {
            if (iOSCurrentVersion > userVersionNumber) {
              this.presentUpdateAlert(
                res.displayText.title,
                res.displayText.message,
                res.displayText.btn,
                res.forceful
              );
            }
          }
          
        }

        this.storageService.store("update", res);
      },
      (err: any) => {
        this.storageService.get("update").then(
          async (res: appUpdate) => {
            if (res) {
              this.appUpdateDetails.status = res.status;
              this.appUpdateDetails.currentAppVersion.android = res.currentAppVersion.android;
              this.appUpdateDetails.currentAppVersion.android = res.currentAppVersion.android;
              this.appUpdateDetails.forceful = res.forceful;
              // this.appUpdateDetails.displayText = res.displayText;
              this.appUpdateDetails.displayText.btn = res.displayText.btn;
              this.appUpdateDetails.displayText.message = res.displayText.message;
              this.appUpdateDetails.displayText.title = res.displayText.title;
              
              if (res.status) {
                const versionNumber = await this.appVersion.getVersionNumber();
                const userVersionNumber = Number(versionNumber.split(".").join(""));
                
                const iOSCurrentVersion = Number(res.currentAppVersion.iOS.split(".").join(""));
                const androidCurrentVersion = Number(res.currentAppVersion.android.split(".").join(""));
                // const devicePlatform = Capacitor.getPlatform();
      
                if (Capacitor.getPlatform() == "android") {
                  if (iOSCurrentVersion > androidCurrentVersion) {
                    this.presentUpdateAlert(
                      res.displayText.title,
                      res.displayText.message,
                      res.displayText.btn,
                      res.forceful
                    );
                  }
                }
                
                if (Capacitor.getPlatform() == "ios") {
                  if (iOSCurrentVersion > userVersionNumber) {
                    this.presentUpdateAlert(
                      res.displayText.title,
                      res.displayText.message,
                      res.displayText.btn,
                      res.forceful
                    );
                  }
                }
                
              };
            }
          }
        );
      }
    );
  }

  openAppStoreEntry() {
    if (Capacitor.getPlatform() == "android") {
      NativeMarket.openStoreListing({
        appId: 'com.tesamedia.radio'
      });
    }

    if (Capacitor.getPlatform() == "ios") {
      this.inAppBrowser.create("itms-apps://itunes.apple.com/app/id43657345", "_blank")
    }
  }

  async presentUpdateAlert(
    title = this.appUpdateDetails.displayText.title, 
    message = this.appUpdateDetails.displayText.message,
    btn = this.appUpdateDetails.displayText.btn,
    forceful = this.appUpdateDetails.forceful
  ) {

    const buttons: any = [];

    if (btn != '' || this.appUpdateDetails.status) {
      buttons.push({
        text: btn || 'Update',
        handler: () => {
          this.openAppStoreEntry();
        },
      })
    }

    if (!forceful) {
      buttons.push({
        text: 'Close',
        role: 'cancel'
      })
    }

    const alert = await this.alertController.create({
      header: title,
      // subHeader: 'New update avaliable',
      message,

      backdropDismiss: forceful,
      keyboardClose: false,
      mode: 'ios',
      animated: true,
      translucent: true,
      buttons: buttons ,
    });

    await alert.present();
  }
  
}
