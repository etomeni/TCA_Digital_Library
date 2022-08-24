import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { IonModal } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class announcementPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;
  submitted = false;
  sent = false;
  shareTestimony = false;

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  announcements: any[];
  modalAnnouncement: any;

  constructor(
    private storageService: StorageService,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    this.storageService.get('announcements').then(
      (res: any) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
  
          this.announcements = res;
          this.loadingStatus = true;
        }
      }
    );

    this.getAnnouncement();
  }

  async getAnnouncement() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("announcements").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key);
        // console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("announcements", this.totalDBlength).then(
      (res: any) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
        }

        this.announcements = res;
        this.loadingStatus = true;
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }

  doRefresh(event) {
    // window.location.reload();
    this.getAnnouncement();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  loadMoreShowData() {
    this.databaseService.getFbDBpartData("announcements", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);
        if(res.length < 1) {
          this.loadMoreState = false;
        } else {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }
        }
        
        this.announcements = [...this.announcements, ...res];
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

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  openViewModal(item: any) {
    this.modalAnnouncement = item;
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}

 