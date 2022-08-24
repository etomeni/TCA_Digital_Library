import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

import { Location } from '@angular/common';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-contact-msg',
  templateUrl: './contact-msg.page.html',
  styleUrls: ['./contact-msg.page.scss'],
})
export class ContactMsgPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  btnStatus = {
    replied: false,
    delete: false,
  }

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  contactUs: any = [];
  modalContactMessage: any;

  constructor(
    public alertController: AlertController,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit() {
    this.storageService.get('contactUs').then(
      (res: any) => {
        if (res) {
          this.contactUs = res;
          this.loadingStatus = true;
        }
      }
    );

    this.getContactMessages();
  }

  async getContactMessages() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("contactUs").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key) || 0;
        // console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("contactUs", this.totalDBlength).then(
      (res: any) => {
        // console.log(res);
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.delete == true) {
              res.splice(i, 1); 
              i--;
            }
          }
        }

        this.contactUs = res;
        this.loadingStatus = true;
        this.storageService.store('contactUs', this.contactUs);
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }


  loadMoreShowData() {
    this.databaseService.getFbDBpartData("contactUs", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);
        if(res.length < 1) {
          this.loadMoreState = false;
        }

        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.delete == true) {
              res.splice(i, 1); 
              i--;
            }
          }
        }

        this.contactUs = [...this.contactUs, ...res];
        this.storageService.store('contactUs', this.contactUs);
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
    this.getContactMessages();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  goback(){
    this.location.back();
  }

  openViewModal(i: number, item: any) {
    item.index = i;
    this.modalContactMessage = item;

    this.modal.present();
  }

  deleteContactMsg(item: any) {
    this.btnStatus.delete = true;

    const id = item.id || this.modalContactMessage.id || item.index || this.modalContactMessage.index;
    const path = `contactUs/${ id }`;
    
    this.databaseService.updateRealtimeDBdata(path, { delete: true }).then( () => {
      this.presentAlert("Contact message has been deleted!");
      this.btnStatus.delete = false;
      
      this.contactUs[`${ id }`].delete = true;
      this.contactUs.splice(id, 1); 

      this.cancel();
    }).catch( err => {
      this.presentAlert("An error ocurred!");
      this.btnStatus.delete = false;
      console.log(err);
    });

    this.cancel();
  }

  repliedContactMsg(item: any) {
    this.btnStatus.replied = true;

    const id = item.id || this.modalContactMessage.id || item.index || this.modalContactMessage.index;
    const path = `contactUs/${ id }`;
    
    this.databaseService.updateRealtimeDBdata(path, { status: true }).then( () => {
      this.presentAlert("Contact message has been responded to!");
      this.btnStatus.replied = false;

      this.contactUs[`${ id }`].status = true;

      this.cancel();
    }).catch( err => {
      this.presentAlert("An error ocurred!");
      this.btnStatus.replied = false;
      console.log(err);
    });

    this.cancel();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
