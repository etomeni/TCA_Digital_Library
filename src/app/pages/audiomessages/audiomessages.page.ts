import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll, IonModal, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { interval } from 'rxjs';

import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AudioPlayerService } from 'src/app/services/audio-player.service';

@Component({
  selector: 'app-audiomessages',
  templateUrl: './audiomessages.page.html',
  styleUrls: ['./audiomessages.page.scss'],
})
export class AudioMessagesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  volumeType: any = "volume-medium";
  volumeRange: any = 100;

  interval: any;

  playingAudioID: any = null;
  audioMessages: any = this.audioService.audioMessages;
  modalMessages: any;

  constructor(
    private router: Router,
    private audioService: AudioPlayerService,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private toastController: ToastController,
    ) { }

  ngOnInit() {
    this.storageService.get('audioMessages').then(
      (res: any) => {
        if (res) {
          this.audioMessages = res;
          this.loadingStatus = true;
        }
      }
    );

    this.getAudioMessages();
  }
  
  
  getAudioMessages() {
    this.databaseService.endAll = false;
    
    this.audioService.getAudioMessages();

    this.interval = setInterval(() => {
      // here do whatever you want every 0.5 seconds
      if (this.audioMessages == null) {
        this.audioMessages = this.audioService.audioMessages;
        this.playingAudioID = this.audioService.playingAudioID;
      };

      if (this.playingAudioID != null) {
        this.rangeSlider(this.playingAudioID);
        this.localStorage();
      }
    }, 500);
  }

  durationChange(event, id) {
    this.audioService.audioMessages[id].audio.currentTime = this.audioService.audioMessages[id].audio.duration * (event.detail.value / 100);
    // console.log(this.audioService.audioMessages[id].audio.currentTime);
  }

  volumeChange(event, id) {
    let vol = event / 100;
    this.audioService.audioMessages[id].audio.volume = vol;

    if (event <= 5) {
      this.volumeType = "volume-off";
    } else if (event > 5 && event <= 25) {
      this.volumeType = "volume-low";
    } else if (event > 25 && event <= 75) {
      this.volumeType = "volume-medium";
    } else if (event > 75) {
      this.volumeType = "volume-high";
    } else {
      this.volumeType = "volume-medium";
    }
  }

  rangeSlider(id) {
    if (this.audioService.audioMessages[id].audio.paused) {
      this.pause(id);
    }
    // let audioRangeSlider = this.ElementRef.nativeElement.querySelector('#duration'+id);
    // audioRangeSlider.value = 0;

    // DURATION RANGE:::: working using ngmodel
    if (!isNaN(this.audioService.audioMessages[id].audio.duration)) {
      let audioCurrentPosition = this.audioService.audioMessages[id].audio.currentTime * (100 / this.audioService.audioMessages[id].audio.duration);
      // audioRangeSlider.value = audioCurrentPosition;

      this.audioMessages[id].durationRange = Math.round(audioCurrentPosition * 100) / 100;
      
    }

    // IF THE SONG IS ENDS THE PLAY BUTTON SHOULD BE ENABLED
    if (this.audioService.audioMessages[id].audio.ended || this.audioService.audioMessages[id].audio.duration === this.audioService.audioMessages[id].audio.currentTime) {
      document.getElementById('aPlayBTN'+id).style.display = "inline";
      document.getElementById('aPauseBTN'+id).style.display = "none";
      document.getElementById('aWave'+id).style.display = "none";
    }

    let currentTime = this.audioDurationFunction(this.audioService.audioMessages[id].audio, "currentTime");
    let duration = this.audioDurationFunction(this.audioService.audioMessages[id].audio, "duration");

    this.audioMessages[id].currentTime = currentTime;
    this.audioMessages[id].duration = duration;
    
  }

  muteVolume(id) {
    this.audioService.audioMessages[id].audio.volume = 0;
    this.volumeType = "volume-mute";
    // this.ElementRef.nativeElement.querySelector("#volume").value = 0;
    this.volumeRange = 0;
  }

  unmuteVolume(id) {
    this.audioService.audioMessages[id].audio.volume = 1;
    this.volumeType = "volume-high";
    // this.ElementRef.nativeElement.querySelector("#volume").value = 100;
    this.volumeRange = 100;
  }

  play(id) {
    this.audioService.play({type: 'audioMessages', id}).then(
      (res: any) => {
        document.getElementById('aPlayBTN'+id).style.display = "none";
        document.getElementById('aPauseBTN'+id).style.display = "inline";
        document.getElementById('aWave'+id).style.display = "block";
      },
      (err: any) => {
        document.getElementById('aPlayBTN'+id).style.display = "inline";
        document.getElementById('aPauseBTN'+id).style.display = "none";
        document.getElementById('aWave'+id).style.display = "none";
        
        this.presentToast("Unable to play audio, Please check internet connection or reload the app!!!");
      }
    );


    interval(500).subscribe((func => {
      if (this.audioService.playingAudio.paused) {
        document.getElementById('aPlayBTN'+id).style.display = "inline";
        document.getElementById('aPauseBTN'+id).style.display = "none";
        document.getElementById('aWave'+id).style.display = "none";
      }
    }))
  }

  pause(id) {
    this.audioService.pause({type: 'audioMessages', id});

    document.getElementById('aPlayBTN'+id).style.display = "inline";
    document.getElementById('aPauseBTN'+id).style.display = "none";
    document.getElementById('aWave'+id).style.display = "none";

    clearInterval(this.interval);
  }

  audioDurationFunction(audio, durationType) {

    if(audio.readyState > 0) {
      if (durationType === "duration") {
        var duration = audio.duration;
      } else if (durationType === "currentTime") {
        var duration = audio.currentTime;
      }

      var seconds: any = Math.floor(duration % 60);
      var foo = duration - seconds;
      var min: any = foo / 60;
      var minutes: any = Math.floor(min % 60);
      var hours: any = Math.floor(min / 60);

      if(seconds < 10){
        seconds = "0" + seconds.toString();
      }

      if(hours > 0){
        let audioDuration = hours + ":" + minutes + ":" + seconds;
        return audioDuration;
      } else {
        let audioDuration = minutes + ":" + seconds;
        return audioDuration;
      }
      
    }

  }

  localStorage() {
    if (this.router.url === "/audiomessages") {
      this.storageService.get("playing").then(res => {
        let response: any = res;
        if (response.PlayingMedia == "audioMessages" && response.Status == "played") {
          document.getElementById('aPlayBTN'+response.audioID).style.display = "none";
          document.getElementById('aPauseBTN'+response.audioID).style.display = "inline";
          document.getElementById('aWave'+response.audioID).style.display = "block";
        } 
      })
    }
  }

  playFunc(id) {
    let duration = this.audioDurationFunction(this.audioService.audioMessages[id].audio, "duration");
    this.audioService.audioMessages[id].duration = duration;

    // if(this.audioService.audioMessages[id].audio.readyState > 0) {
      this.audioService.play(id);
      this.playingAudioID = id;
    // }
  }

  doRefresh(event) {
    this.ngOnInit();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  loadMoreData(event) {
    this.audioService.loadMoreAudioMessages();

    setTimeout(() => {
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.audioService.loadMoreState == false) {
        event.target.disabled = true;
      }

      this.audioService.loadMoreindex += 1;
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }


  openViewModal(item: any) {
    this.modalMessages = item;
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

}
