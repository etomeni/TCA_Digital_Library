import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

import { Location } from '@angular/common';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-pray-requestz',
  templateUrl: './pray-requestz.page.html',
  styleUrls: ['./pray-requestz.page.scss'],
})
export class PrayRequestzPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  submitted = false;

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  prayerRequests: any = [];
  modalPrayerRequest: any;

  constructor(
    public alertController: AlertController,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit() {
    this.storageService.get('prayerRequests').then(
      (res: any) => {
        if (res) {
          this.prayerRequests = res;
          this.loadingStatus = true;
        }
      }
    );

    this.getPrayerRequests();
  }

  async getPrayerRequests() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("prayerRequests").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key) || 0;
        // console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("prayerRequests", this.totalDBlength).then(
      (res: any) => {
        // console.log(res);
        this.prayerRequests = res;
        this.loadingStatus = true;
        this.storageService.store('prayerRequests', this.prayerRequests);
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }


  loadMoreShowData() {
    this.databaseService.getFbDBpartData("prayerRequests", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);
        if(res.length < 1) {
          this.loadMoreState = false;
        }

        this.prayerRequests = [...this.prayerRequests, ...res];
        this.storageService.store('prayerRequests', this.prayerRequests);
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
    this.getPrayerRequests();

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
    this.modalPrayerRequest = item;

    this.modal.present();
  }

  answered(item: any) {
    this.submitted = true;

    const path = `prayerRequests/${ item.id || this.modalPrayerRequest.id || item.index || this.modalPrayerRequest.index }`;
    
    this.databaseService.updateRealtimeDBdata(path, { status: true }).then( () => {
      this.presentAlert("Prayer request has been answered!");
      this.submitted = false;

      this.prayerRequests[`${ item.id || this.modalPrayerRequest.id || item.index || this.modalPrayerRequest.index }`].status = true;

      this.cancel();
    }).catch( err => {
      this.presentAlert("An error ocurred!");
      this.submitted = false;
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
