import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { interval } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LiveRadioService {

  TCARadio: any;
  //  = new Audio("https://stream.zeno.fm/1z937nxzhchvv.aac?aw_0_req_lsid=abb8ff6579ff6846da042209e9f8cc8c&amp;cto-uid=82be2501-73c1-4d64-8cd6-d8e89c98334a-61c88d08-4e47&amp;bsw-uid=9a5e42dc-e03e-4a58-a899-f08b49a1fb02&amp;acu-uid=634703972344&amp;dyn-uid=03030002_61c88d5f77c87&amp;ttd-uid=b2fc98ed-cfd9-43fe-80b0-41390fd58d43&amp;an-uid=6052206826910576709&amp;mm-uid=3cbc61c8-8d0d-4700-a588-0e7c76352f48&amp;triton-uid=cookie%3A09ce438b-1c48-45c3-a2ed-9ea945b6806a&amp;adt-uid=cuid_5e8b5326-6662-11ec-afcb-1202f1c33782&amp;amb-uid=3382607208856530122&amp;aw-uid=abb8ff6579ff6846da042209e9f8cc8c&amp;dbm-uid=CAESEEXwF8Vm2hCiuyiCtEpt0vg");

  playing: boolean = false;

  constructor(
    private router: Router,
    private StorageService: StorageService,
    private toastController: ToastController,
  ) { 
    // this.TCARadio.setAttribute("type", "audio/mpeg");
    // this.TCARadio.load();
  }

  playRadio(timeout: boolean = false) {
    try {
      this.TCARadio.play()
      .then(
        fufil => {
          document.getElementById("play-BTN").style.display = "none";
          document.getElementById("pause-BTN").style.display = "block";
          if (timeout) {
            document.getElementById("wave").style.display = "none";
          } else {
            document.getElementById("wave").style.display = "block";
          }
          this.TCARadio.addEventListener("playing", ()=>{
            document.getElementById("wave").style.display = "block";
          });
          this.playing = true;

          // add to storage that its playing;
          this.StorageService.store("playing", {
            Status: "played",
            PlayingMedia: "radio"
          });
        },
        rej => {
          document.getElementById("play-BTN").style.display = "none";
          document.getElementById("pause-BTN").style.display = "block";
          document.getElementById("wave").style.display = "none";

          var i = 0;
          interval(10000).subscribe((func => {
            if (!this.playing) {
              if (i < 3) {
                if (i<1) {
                  this.pauseRadio();
                  this.TCARadio.load();
                  // console.log("radio pause"+i);
                }
                this.presentToast("Unable to play Radio, Please check internet connection or reload the app!!!");
                // console.log(i);
              }
              i++;
            }
          }));

        }
      )
      .catch(() => {
        this.presentToast("Unable to play Radio, Reloading the page in a bit, please wait...", 8000);
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      });
    } catch (error) {
      this.presentToast("Unable to play Radio, Reloading the page in a bit, please wait...", 8000);
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }

  }

  pauseRadio() {
    // var Radio = document.getElementById("playRadio");
    if (this.router.url === "/radio" || this.router.url === "/inframe-radio") {
      document.getElementById("play-BTN").style.display = "block";
      document.getElementById("pause-BTN").style.display = "none";
      document.getElementById("wave").style.display = "none";

    } else {
      this.StorageService.store("outsideRadio", {
        pauseFrmOutside: true,
        Status: "radio",
      });
    }

    this.TCARadio.pause();
  }

  async presentToast(message, duration: number = 5000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

}
