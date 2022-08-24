import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AudioMessagesService {
  playingAudioID: any = null;

  audioMessages: any;
  
  totalDBlength: number;
  loadMoreindex: number = 0;
  loadMoreState: boolean = true;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private DatabaseService: DatabaseService,
  ) { }

  async getAudioMessages() {
    await this.DatabaseService.getLastKey("audioMessages").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.DatabaseService.getFbDBpartData("audioMessages", this.totalDBlength).then(
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

  play(id) {
    if (this.playingAudioID === null) {
      // if(this.audioMessages[id].audio.readyState > 0) {
        document.getElementById('aPlayBTN'+id).style.display = "none";
        document.getElementById('aPauseBTN'+id).style.display = "inline";
        document.getElementById('aWave'+id).style.display = "block";


        this.audioMessages[id].audio.play();
        this.playingAudioID = id;

        this.storageService.store("playing", {
          Status: "played",
          PlayingMedia: "audioMessages",
          audioID: id
        });
      // }
    } else {
      this.pause(this.playingAudioID);

      // if(this.audioMessages[id].audio.readyState > 0) {
        document.getElementById('aPlayBTN'+id).style.display = "none";
        document.getElementById('aPauseBTN'+id).style.display = "inline";
        document.getElementById('aWave'+id).style.display = "block";


        this.audioMessages[id].audio.play();
        this.playingAudioID = id;

        this.storageService.store("playing", {
          Status: "played",
          PlayingMedia: "audioMessages",
          audioID: id
        });
        
      // }
    }
    
  }

  pause(id) {
    if (this.router.url === "/audiomessages") {
      document.getElementById('aPlayBTN'+id).style.display = "inline";
      document.getElementById('aPauseBTN'+id).style.display = "none";
      document.getElementById('aWave'+id).style.display = "none";

    } else {
      this.storageService.store("outSideAudio", {
        pauseFrmOutside: true,
        Status: "audioMessages",
        audioID: id
      });
    }

    this.playingAudioID = id;
    this.audioMessages[id].audio.pause();
  }

  loadMoreShowData() {
    this.DatabaseService.getFbDBpartData("audioMessages", undefined, this.loadMoreindex).then(
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

}
