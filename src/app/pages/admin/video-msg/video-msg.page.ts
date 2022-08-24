import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-msg',
  templateUrl: './video-msg.page.html',
  styleUrls: ['./video-msg.page.scss'],
})
export class VideoMsgPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  videoMsgForm: FormGroup;
  submitted = false;
  addEditVideo = false;
  addVideoMsg = false;
  
  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  videoMessages: any = [];
  modalVideoMsg: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private location: Location,
    public sanitizer: DomSanitizer,
    private storageService: StorageService,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    this.videoMsgForm = this.formBuilder.group({
      service: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      title: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],

      link: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });

    this.getVideoMsgs();
  }

  async getVideoMsgs() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("videoMessages").then(
      (res: any) => {
        // console.log(res);
        this.totalDBlength = Number(res[0].key || 0);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    await this.databaseService.getFbDBpartData("videoMessages", this.totalDBlength).then(
      (res: any) => {
        // console.log('length', res.length);

        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            res[i].link = this.sanitizer.bypassSecurityTrustHtml(element.link);
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
        }

        this.videoMessages = res;
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
    if (this.addVideoMsg) {
      try {
        await this.databaseService.getLastKey("videoMessages").then(
          (res: any) => {
            // console.log(res);
            this.totalDBlength = Number(res[0].key || -1) || 0;
          },
          (err: any) => {
            console.log(err);
          }
        );

        // save in firebase real time database
        let videoMsgFormPath = `videoMessages/${ this.totalDBlength+1 }`;
        var today = new Date();
        const videoMsgFormData = {
          service: this.videoMsgForm.value.service,
          title: this.videoMsgForm.value.title,
          link: this.videoMsgForm.value.link,
          date: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
          id: this.totalDBlength+1,
          status: true,
          dateTime: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()   +' '+  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        };
        
        this.databaseService.saveToRealtimeDataDB(videoMsgFormPath, videoMsgFormData).then( () => {
          this.submitted = false;
          this.presentAlert("Message has been published.");
          this.videoMsgForm.reset();

          this.getVideoMsgs();

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
        // save in firebase real time database
        let videoMsgFormPath = `videoMessages/${ this.modalVideoMsg.id || this.modalVideoMsg.index }`;
        const videoMsgFormData = {
          service: this.videoMsgForm.value.service,
          title: this.videoMsgForm.value.title,
          link: this.videoMsgForm.value.link,
        }
        
        this.databaseService.updateRealtimeDBdata(videoMsgFormPath, videoMsgFormData).then( () => {
          this.presentAlert("Message has been updated!");
          this.submitted = false;
          this.videoMsgForm.reset();
          this.getVideoMsgs();

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
    this.databaseService.updateRealtimeDBdata(`videoMessages/${ item.id || i }`, { status: false, delete: true }).then(
      (res: any) => {
        if (res) {
          this.videoMessages.splice(i, 1);
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
    this.addVideoMsg = false;
    this.addEditVideo = true;

    this.videoMsgForm.get('service').setValue(item.service);
    this.videoMsgForm.get('title').setValue(item.title);
    this.videoMsgForm.get('link').setValue(item.link);

    this.openViewModal(i, item, true);
  }
  
  loadMoreShowData() {
    this.databaseService.getFbDBpartData("videoMessages", this.totalDBlength, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);

        if(res.length < 1) {
          this.loadMoreState = false;
        } else {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            res[i].link = this.sanitizer.bypassSecurityTrustHtml(element.link);
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
        }

        this.videoMessages = [...this.videoMessages, ...res];
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
    this.getVideoMsgs();

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
    this.modalVideoMsg = item;

    if(!editState) {
      this.addVideoMsg = false;
      this.addEditVideo = false;
    }

    this.modal.present();
  }

  addNewBTN() {
    this.videoMsgForm.reset();

    this.addVideoMsg = true;
    this.addEditVideo = true;

    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
