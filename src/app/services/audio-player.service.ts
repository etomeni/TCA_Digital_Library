import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { StorageService } from './storage.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  // RADIO CONTROLS START
    TCARadio: any
    = new Audio("https://stream.zeno.fm/1z937nxzhchvv.aac?aw_0_req_lsid=abb8ff6579ff6846da042209e9f8cc8c&amp;cto-uid=82be2501-73c1-4d64-8cd6-d8e89c98334a-61c88d08-4e47&amp;bsw-uid=9a5e42dc-e03e-4a58-a899-f08b49a1fb02&amp;acu-uid=634703972344&amp;dyn-uid=03030002_61c88d5f77c87&amp;ttd-uid=b2fc98ed-cfd9-43fe-80b0-41390fd58d43&amp;an-uid=6052206826910576709&amp;mm-uid=3cbc61c8-8d0d-4700-a588-0e7c76352f48&amp;triton-uid=cookie%3A09ce438b-1c48-45c3-a2ed-9ea945b6806a&amp;adt-uid=cuid_5e8b5326-6662-11ec-afcb-1202f1c33782&amp;amb-uid=3382607208856530122&amp;aw-uid=abb8ff6579ff6846da042209e9f8cc8c&amp;dbm-uid=CAESEEXwF8Vm2hCiuyiCtEpt0vg");
  
  // RADIO CONTROLS ENDS

  // -------------------------------------------------------------------------- //

  // AUDIO MESSAGES STARTS
  playingAudioID: any = null;
  playingAudio: any = null;
  audioMessages: any;
  
  totalDBlength: number;
  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  // AUDIO MESSAGES ENDS

  // -------------------------------------------------------------------------- //
  
  constructor(
    // private router: Router,
    private toastController: ToastController,
    private storageService: StorageService,
    private databaseService: DatabaseService,
  ) { 
    // this.getRadio();
    this.mediaSession();
  }

  // RADIO CONTROLS START
  async getRadio() {
    await this.databaseService.getRealtimeDBdata("live").then(
      (res: any) => {
        // console.log(res);
        this.TCARadio = new Audio(res[0].radio);
        
        this.storageService.store("live", res);
      },
      (err: any) => {
        // console.log(err);
        this.storageService.get("live").then(
          (res: any) => {
            if (res) {
              // console.log(res);
              this.TCARadio = new Audio(res[0].radio);
            }
          },
          (err: any) => {
            // console.log(err);
          }
        )
      }
    );
    this.TCARadio.load();

    // navigator.
  }

  async getAudioMessages() {
    await this.databaseService.getLastKey("audioMessages").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("audioMessages", this.totalDBlength).then(
      (res: any) => {

        for (let i = 0; i < res.length; i++) {
          const element = res[i];

          res[i].audio = new Audio(element.audio);
          res[i].currentTime = null;
          res[i].duration = null;
          res[i].durationRange = 0;

          if (element.status == false) {
            res.splice(i, 1); 
            i--; 
          }
        }

        this.audioMessages = res;
        this.storageService.store('audioMessages', this.audioMessages);
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }

  play(data={type: '', id: ''}) {
    if (this.playingAudio) {
      this.playingAudio.pause();
      // this.playingAudio = null;
    }

    const resolveResponse = {
      status: true,
      playingAudio: '',
      res: ''
    };

    const rejectResponse = {
      status: false,
      playingAudio: '',
      err: ''
    };

    return new Promise<any> (async (resolve, reject) => {
      switch (data.type) {
        case "radio":
          await this.TCARadio.play().then(
            (res: any) => {
              this.playingAudio = this.TCARadio;
    
              this.TCARadio.addEventListener("playing", ()=>{
                document.getElementById("wave").style.display = "block";
              });

              resolveResponse.playingAudio = this.TCARadio;
              resolveResponse.res = res;
              resolve(resolveResponse);
            },
            (err: any) => {
              this.TCARadio.load();

              rejectResponse.playingAudio = this.TCARadio;
              rejectResponse.err = err;
              reject(rejectResponse);
            }
          );

          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: "TCA Digital Radio",
              artist: 'TCA media team',
              album: "The Comforter's Assembly",
              artwork: [
                { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'playing';
          };

          break;
      
        case "audioMessages":
          await this.audioMessages[data.id].audio.play().then(
            (res: any) => {
              this.playingAudioID = data.id;
              this.playingAudio = this.audioMessages[data.id].audio;
     
              resolveResponse.playingAudio = this.audioMessages[data.id].audio;
              resolveResponse.res = res;
              resolve(resolveResponse);
            },
            (err: any) => {
              rejectResponse.playingAudio = this.audioMessages[data.id].audio;
              rejectResponse.err = err;
              reject(rejectResponse);
            }
          );

          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: this.audioMessages[data.id].title,
              artist: 'TCA Digital Library',
              album: this.audioMessages[data.id].service,
              artwork: [
                { src: this.audioMessages[data.id].image || 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'playing';
          };

          break;
      
        default:
          await this.playingAudio.play().then(
            (res: any) => {
              resolveResponse.playingAudio = this.playingAudio;
              resolveResponse.res = res;
              resolve(resolveResponse);
            },
            (err: any) => {
              rejectResponse.playingAudio = this.playingAudio;
              rejectResponse.err = err;
              reject(rejectResponse);
            }
          );

          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: "TCA Digital Library",
              artist: 'TCA media team',
              album: "The Comforter's Assembly",
              artwork: [
                { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'playing';
          };

          break;
      };
    })
  }

  pause(data={type: '', id: ''}) {
    const resolveResponse = {
      status: true,
      playingAudio: '',
      res: ''
    };

    const rejectResponse = {
      status: false,
      playingAudio: '',
      err: ''
    };

    return new Promise<any> ((resolve, reject) => {
      switch (data.type) {
        case "radio":
          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: "TCA Digital Radio",
              artist: 'TCA media team',
              album: "The Comforter's Assembly",
              artwork: [
                { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'paused';
          }

          this.TCARadio.pause();
          if (this.playingAudio.paused) {
            this.playingAudio = this.TCARadio;
  
            resolveResponse.playingAudio = this.TCARadio;
            resolve(resolveResponse);
          } else {
            rejectResponse.playingAudio = this.TCARadio;
            reject(rejectResponse);
          }

          break;
      
        case "audioMessages":
          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: this.audioMessages[data.id].title,
              artist: 'TCA Digital Library',
              album: this.audioMessages[data.id].service,
              artwork: [
                { src: this.audioMessages[data.id].image || 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'playing';
          }

          this.audioMessages[data.id].audio.pause();
          if (this.audioMessages[data.id].audio.paused) {
            this.playingAudioID = data.id;
            this.playingAudio = this.audioMessages[data.id].audio;

            resolveResponse.playingAudio = this.audioMessages[data.id].audio;
            resolve(resolveResponse);
          } else {
            rejectResponse.playingAudio = this.audioMessages[data.id].audio;
            reject(rejectResponse);
          };

          break;
      
        default:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: "TCA Digital Library",
              artist: 'TCA media team',
              album: "The Comforter's Assembly",
              artwork: [
                { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
              ]
            });
          
            // TODO: Update playback state.
            navigator.mediaSession.playbackState = 'paused';
          }

          if (this.playingAudio) {
            this.playingAudio.pause();
            if (this.playingAudio.paused) {
              resolveResponse.playingAudio = this.playingAudio;
              resolve(resolveResponse);
            } else {
              rejectResponse.playingAudio = this.playingAudio;
              reject(rejectResponse);
            }
          }

          break;
      }
    });
  }

  loadMoreAudioMessages() {
    this.databaseService.getFbDBpartData("audioMessages", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);

        if(res.length < 1) {
          this.loadMoreState = false;
        } else {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
  
            res[i].audio = new Audio(element.audio);
            res[i].currentTime = null;
            res[i].duration = null;
            res[i].durationRange = 0;
  
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
        }

        this.audioMessages = [...this.audioMessages, ...res];
        this.storageService.store('audioMessages', this.audioMessages);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async presentToast(message, duration: number = 5000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }


  mediaSession() {
    navigator.mediaSession.setActionHandler('play', async () => {
      // Resume playback
      navigator.mediaSession.playbackState = 'playing';
      this.play();
    });
    
    navigator.mediaSession.setActionHandler('pause', () => {
      // Pause active playback
      navigator.mediaSession.playbackState = 'paused';
      this.pause();
    });
    

    if (this.playingAudio) {
      navigator.mediaSession.playbackState = this.playingAudio.paused ? "paused" : "playing";
    
      this.playingAudio.addEventListener('play', () => {
        navigator.mediaSession.playbackState = 'playing';
        this.play();
      });
    
      this.playingAudio.addEventListener('pause', () => {
        navigator.mediaSession.playbackState = 'paused';
        this.pause();
      });
    }

  }

}