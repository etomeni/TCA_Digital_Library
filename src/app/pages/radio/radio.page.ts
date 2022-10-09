import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { interval } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioPlayerService } from 'src/app/services/audio-player.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.page.html',
  styleUrls: ['./radio.page.scss'],
})
export class RadioPage implements OnInit {
  headerData = {
    translucent: true || false,
    firstText_red: "Consolation ",
    firstText_white: " Radio",
  };

  loadingStatus: boolean = false;

  liveTV: any = {};

  loadingReadyState: boolean = true;
  timeout: boolean = false;

  constructor(
    private storageService: StorageService,
    private audioService: AudioPlayerService,
    private toastController: ToastController,
    private databaseService: DatabaseService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.timeout = true;
    }, 20000);

    this.getRadio();
    this.getSettingsDetails();
  }
  
  getRadio() {
    this.databaseService.endAll = false;
    
    this.databaseService.getFbDBpartData("live").then(
      (res: any) => {
        // console.log(res);
        this.audioService.TCARadio = new Audio(`${res[0].radio}`);
        this.liveTV.link = this.sanitizer.bypassSecurityTrustHtml(res[0].tv);
        this.liveTV.status = res[0].tvStatus;

        this.audioService.TCARadio.setAttribute("type", "audio/mpeg");
        this.audioService.TCARadio.load();
        
        this.loadingStatus = true;

        interval(500).subscribe((func => {
          if (this.loadingReadyState) {
            document.getElementById("play-BTN").style.display = "none";
            document.getElementById("pause-BTN").style.display = "none";
    
            if (this.audioService.TCARadio.readyState > 1 || this.timeout) {
              this.loadingReadyState = false;
              document.getElementById("play-BTN").style.display = "block";
              if (this.timeout) {
                this.presentToast("Unable to Load Radio :-(");
                // console.log("second timeout");
              }
              if (this.audioService.TCARadio.readyState > 1) {
                setTimeout(() => {
                  this.playRadio();
                }, 2000);
              }
            }
          } 
        }));

        this.audioService.TCARadio.addEventListener('play', () => {
          navigator.mediaSession.playbackState = 'playing';

          document.getElementById("play-BTN").style.display = "none";
          document.getElementById("pause-BTN").style.display = "block";
          document.getElementById("wave").style.display = "block";
        });
      
        this.audioService.TCARadio.addEventListener('pause', () => {
          navigator.mediaSession.playbackState = 'paused';

          document.getElementById("play-BTN").style.display = "block";
          document.getElementById("pause-BTN").style.display = "none";
          document.getElementById("wave").style.display = "none";
        });

      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  playRadio() {
    this.audioService.play({type: 'radio', id: '0'}).then(
      (res: any) => {
        document.getElementById("play-BTN").style.display = "none";
        document.getElementById("pause-BTN").style.display = "block";
      },
      (err: any) => {
        document.getElementById("play-BTN").style.display = "block";
        document.getElementById("pause-BTN").style.display = "none";
        document.getElementById("wave").style.display = "none";
        
        this.presentToast("Unable to play Radio, Please check internet connection or reload the app!!!");
      }
    );
  }

  pauseRadio() {
    this.audioService.pause({type: 'radio', id: '0'});
    
    document.getElementById("play-BTN").style.display = "block";
    document.getElementById("pause-BTN").style.display = "none";
    document.getElementById("wave").style.display = "none";
  }

  doRefresh(event) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      icon: 'information-circle',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getSettingsDetails() {
    this.databaseService.getRealtimeDBdata("settings").then(
      (res: any) => {
        // console.log(res);
        this.storageService.store("settings", res);
      },
      (err: any) => {
        // console.log(err);
      }
    );
  }

}