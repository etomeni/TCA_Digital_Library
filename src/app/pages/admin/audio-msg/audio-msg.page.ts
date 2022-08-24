import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs';

@Component({
  selector: 'app-audio-msg',
  templateUrl: './audio-msg.page.html',
  styleUrls: ['./audio-msg.page.scss'],
})
export class AudioMsgPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('audioTag') audioTag: ElementRef; // audio tag reference

  loadingStatus: boolean = false;

  audioMsgForm: FormGroup;
  submitted = false;
  addEditAudio = false;
  addAudioMsg = false;
  editAudioZtate = false;

  audioFile: any;
  audioPreview: any;

  imgFile: any;
  uploadImgPreview: any;
  imgFileError: boolean = false;

  // play audio in modal view parameters
  interval: any;
  playingZtate: boolean = false;

  
  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  audioMessages: any = [];
  modalAudioMsg: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private location: Location,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.audioMsgForm = this.formBuilder.group({
      service: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      title: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],

      image: ['', [
        // Validators.required,
        // Validators.minLength(5)
      ]],

      audio: ['', [
        // Validators.required,
        // Validators.minLength(10)
      ]]
    });

    this.getAudioMsgs();
  }

  async getAudioMsgs() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("audioMessages").then(
      (res: any) => {
        // console.log(res);
        this.totalDBlength = Number(res[0].key || 0);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    await this.databaseService.getFbDBpartData("audioMessages", this.totalDBlength).then(
      (res: any) => {
        // console.log('length', res.length);

        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];

            res[i].audiozz = element.audio;
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

        this.audioMessages = res;
        this.loadingStatus = true;
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.addAudioMsg) {
      try {
        await this.databaseService.getLastKey("audioMessages").then(
          (res: any) => {
            // console.log(res);
            this.totalDBlength = Number(res[0].key || -1) || 0;
          },
          (err: any) => {
            console.log(err);
          }
        );

        // save in firebase real time database
        let audioFileUrl = "";
        await this.databaseService.uploadFile2firebase(`audioMessages/audio/${ this.totalDBlength+1 }`, this.audioFile).then(
          (res: any) => {
            // console.log(res);
            audioFileUrl = res;
          },
          (err: any) => {
            console.log(err);
          }
        );
        
        let imageUrl = "";
        if (this.imgFile) {
          await this.databaseService.uploadFile2firebase(`audioMessages/images/${ this.totalDBlength+1 }`, this.imgFile).then(
            (res: any) => {
              // console.log(res);
              imageUrl = res;
            },
            (err: any) => {
              console.log(err);
            }
          );
        }

        let audioMsgFormPath = `audioMessages/${ this.totalDBlength+1 }`;

        var today = new Date();
        const audioMsgFormData = {
          service: this.audioMsgForm.value.service,
          title: this.audioMsgForm.value.title,
          audio: audioFileUrl,
          image: imageUrl,
          date: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
          id: this.totalDBlength+1,
          status: true,
          dateTime: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()   +' '+  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        };
        
        this.databaseService.saveToRealtimeDataDB(audioMsgFormPath, audioMsgFormData).then( () => {
          this.submitted = false;
          this.presentAlert("Message has been published.");
          this.audioMsgForm.reset();

          this.getAudioMsgs();

          this.cancel();
        }).catch( err => {
          this.presentAlert("An error ocurred while publishing this message");
          this.submitted = false;
          console.log(err);
        });
        
      } catch (error) {
        this.presentAlert("Ooops, an error just ocurred, please check your connection and try again.");
        this.submitted = false;
        console.log(error);
      }
    } else {
      try {
        let audioMsgFormData = {
          service: this.audioMsgForm.value.service,
          title: this.audioMsgForm.value.title,
          audio: this.modalAudioMsg.audiozz,
          image: this.modalAudioMsg.image,
        }

        // save in firebase real time database
        if (this.audioFile) {
          await this.databaseService.uploadFile2firebase(`audioMessages/audio/${ this.modalAudioMsg.id || this.modalAudioMsg.index }`, this.audioFile).then(
            (res: any) => {
              // console.log(res);
              audioMsgFormData.audio = res;
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
        
        if (this.imgFile) {
          await this.databaseService.uploadFile2firebase(`audioMessages/images/${ this.modalAudioMsg.id || this.modalAudioMsg.index }`, this.imgFile).then(
            (res: any) => {
              // console.log(res);
              audioMsgFormData.image = res;
            },
            (err: any) => {
              console.log(err);
            }
          );
        }

        // save in firebase real time database
        const audioMsgFormPath = `audioMessages/${ this.modalAudioMsg.id || this.modalAudioMsg.index }`;
        
        this.databaseService.updateRealtimeDBdata(audioMsgFormPath, audioMsgFormData).then( () => {
          this.presentAlert("Message has been updated!");
          this.submitted = false;
          this.audioMsgForm.reset();
          this.getAudioMsgs();

          this.cancel();
        }).catch( err => {
          this.presentAlert("An error ocurred while editing the testimony");
          this.submitted = false;
          console.log(err);
        });
        
      } catch (error) {
        this.presentAlert("Ooops, an error just ocurred, please check your connection and try again.");
        this.submitted = false;
        console.log(error);
      }
    }

  }

  deleteItem(i: number, item: any) {
    // console.log(i, item);
    this.databaseService.updateRealtimeDBdata(`audioMessages/${ item.id || i }`, { status: false, delete: true }).then(
      (res: any) => {
        if (res) {
          this.audioMessages.splice(i, 1);
          this.presentAlert("message deleted successfully!!!");
          this.cancel();
        }
      },
      (err: any) => {
        console.log(err);
        this.presentAlert("oops an error ocurred!!!");
      }
    );
  }

  editItem(i: number, item: any) {
    this.addAudioMsg = false;
    this.addEditAudio = true;

    this.audioPreview = false;
    this.editAudioZtate = true;

    this.audioMsgForm.get('service').setValue(item.service);
    this.audioMsgForm.get('title').setValue(item.title);

    this.uploadImgPreview = item.image;

    // item.audio.setAttribute("type", "audio/mpeg");
    this.modalAudioMsg = item;
    this.modalAudioMsg.audio.load();

    this.openViewModal(i, item, true);
  }

  audioFilePreview(e) {
    this.audioFile = (e.target as HTMLInputElement).files[0];

    this.editAudioZtate = false;

    if (e.target.files && e.target.files[0]) {
      this.audioPreview = URL.createObjectURL(e.target.files[0]);
      this.audioTag.nativeElement.src = this.audioPreview;
    }
  }

  imagePreview(e) {
    // this.imgFile = (e.target as HTMLInputElement).files[0];
    let imgFile = (e.target as HTMLInputElement).files[0];
    
    if(imgFile.size > 500500) {
      this.uploadImgPreview = undefined;
      this.imgFileError = true;

      this.presentAlert("File size should not be more than 500kb.");
      this.audioMsgForm.get('image').reset();
    } else {
      this.imgFile = imgFile;

      const reader = new FileReader();
      reader.onload = () => {
        this.uploadImgPreview = reader.result as string;
      }
      reader.readAsDataURL(this.imgFile);
    }
  }
  
  loadMoreShowData() {
    this.databaseService.getFbDBpartData("audioMessages", this.totalDBlength, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);

        if(res.length < 1) {
          this.loadMoreState = false;
        } else {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];

            res[i].audiozz = element.audio;
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
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  loadMoreData(event) {
    this.loadMoreShowData();
    setTimeout(() => {
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.loadMoreState == false) {
        event.target.disabled = true;
      }

      this.loadMoreindex += 1;
    }, 500);
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      // subHeader: message,
      // header: message,
      message: message,
      // buttons: ['OK']
    });
    await alert.present();
  }

  doRefresh(event) {
    this.getAudioMsgs();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  goback(){
    this.location.back();
  }

  openViewModal(i: number, item: any, editState:boolean = false) {
    item.index = i;
    this.modalAudioMsg = item;

    if(!editState) {
      this.addAudioMsg = false;
      this.addEditAudio = false;
    }

    this.modal.present();
  }

  addNewBTN() {
    this.audioMsgForm.reset();

    this.addAudioMsg = true;
    this.addEditAudio = true;

    this.modal.present();
  }


  // play audio in modal view functions 
  durationChange(event) {
    this.modalAudioMsg.audio.currentTime = this.modalAudioMsg.audio.duration * (event.detail.value / 100);
  }

  play() {
    this.modalAudioMsg.audio.play();
    this.playingZtate = true;

    this.interval = setInterval(() => {
      // here do whatever you want every 0.5 seconds
      this.rangeSlider();
      if (this.modalAudioMsg.audio.paused) {
        this.pause();
      }

      if (!this.modalAudioMsg.audio.paused && !this.playingZtate) {
        this.playingZtate = true;
      }
    }, 500);
  }

  pause() {
    this.modalAudioMsg.audio.pause();
    this.playingZtate = false;

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

  rangeSlider() {
    // DURATION RANGE:::: working using ngmodel
    if (!isNaN(this.modalAudioMsg.audio.duration)) {
      let audioCurrentPosition = this.modalAudioMsg.audio.currentTime * (100 / this.modalAudioMsg.audio.duration);
      // audioRangeSlider.value = audioCurrentPosition;
      this.modalAudioMsg.durationRange = Math.round(audioCurrentPosition * 100) / 100;
    }

    let currentTime = this.audioDurationFunction(this.modalAudioMsg.audio, "currentTime");
    let duration = this.audioDurationFunction(this.modalAudioMsg.audio, "duration");

    this.modalAudioMsg.currentTime = currentTime;
    this.modalAudioMsg.duration = duration;
  }
  // ends here;


  cancel() {
    this.modal.dismiss(null, 'cancel');
    if (!this.modalAudioMsg.audio.paused) {
      this.pause();
    }

    this.playingZtate = false;

    this.audioPreview = false;
    this.editAudioZtate = false;
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
