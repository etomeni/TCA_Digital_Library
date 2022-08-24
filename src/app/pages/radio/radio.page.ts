import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { interval } from 'rxjs';
import { LiveRadioService } from 'src/app/services/live-radio.service';
import { AudioMessagesService } from 'src/app/services/audioMessages.service';
import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.page.html',
  styleUrls: ['./radio.page.scss'],
})
export class RadioPage implements OnInit {
  
  loadingStatus: boolean = false;

  liveTV: any = {};

  loadingReadyState: boolean = true;
  timeout: boolean = false;

  constructor(
    private StorageService: StorageService,
    private radioService: LiveRadioService,
    private audioMessagesService: AudioMessagesService,
    private ToastController: ToastController,
    private databaseService: DatabaseService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.timeout = true;
    }, 20000);
    
    this.getRadio();
  }
  
  getRadio() {
    this.databaseService.endAll = false;
    
    this.databaseService.getFbDBpartData("live").then(
      (res: any) => {
        // console.log(res);
        this.radioService.TCARadio = new Audio(`${res[0].radio}`);
        this.liveTV.link = this.sanitizer.bypassSecurityTrustHtml(res[0].tv);
        this.liveTV.status = res[0].tvStatus;

        this.radioService.TCARadio.setAttribute("type", "audio/mpeg");
        this.radioService.TCARadio.load();
        
        this.loadingStatus = true;

        interval(500).subscribe((func => {
          if (this.loadingReadyState) {
            document.getElementById("play-BTN").style.display = "none";
            document.getElementById("pause-BTN").style.display = "none";
    
            if (this.radioService.TCARadio.readyState > 1 || this.timeout) {
              this.loadingReadyState = false;
              document.getElementById("play-BTN").style.display = "block";
              if (this.timeout) {
                this.presentToast("Unable to Load Radio :-(");
                // console.log("second timeout");
              }
              if (this.radioService.TCARadio.readyState > 1) {
                setTimeout(() => {
                  this.playRadio();
                }, 2000);
              }
            }
          } 
    
          this.StorageService.get("outSideRadio").then(res => {
            let response: any = res;
            if (response.pauseFrmOutside && response.Status == "radio") {
              this.pauseRadio();
              this.StorageService.removeItem("outSideRadio");
            }
          })
    
        }));

      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  async playRadio() {
    let playingRes: any = await this.StorageService.get("playing");

    if (playingRes.Status == "played" && playingRes.PlayingMedia == "audioMessages") {
      this.audioMessagesService.pause(playingRes.audioID);
      this.radioService.playRadio(this.timeout);
    } else {
      this.radioService.playRadio(this.timeout);
    }
  }

  pauseRadio() {
    this.StorageService.get("playing").then(res => {
      let response: any = res;
      if (response.PlayingMedia == "radio" && response.Status == "played") {
        this.StorageService.removeItem("playing");
      } 
    });

    this.radioService.pauseRadio();
  }

  doRefresh(event) {
    window.location.reload();
    // this.router.navigate(['radio']);
    // this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async presentToast(message) {
    const toast = await this.ToastController.create({
      message: message,
      duration: 5000,
      // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.ToastController.create({
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

}