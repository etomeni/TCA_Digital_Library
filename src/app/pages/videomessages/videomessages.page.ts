import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-videomessages',
  templateUrl: './videomessages.page.html',
  styleUrls: ['./videomessages.page.scss'],
})
export class VideoMessagesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  loadingStatus: boolean = false;

  playingID: any = null;
  videoMessages: any[] = [];

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  constructor(
    // private router: Router,
    // private audioMessagesService: AudioMessagesService,
    private storageService: StorageService,
    // private radioService: LiveRadioService,
    // private ShowsService: ShowsService,
    private databaseService: DatabaseService,

    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.storageService.get('videoMessages').then(
      (res: any) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            res[i].link = this.sanitizer.bypassSecurityTrustHtml(element.link);
            if (element.status == false) {
              res.splice(i, 1); 
              i--; 
            }
          }

          this.videoMessages = res;
          this.loadingStatus = true;
        }
      }
    );

    this.getVideoMessages();
  }
  
  async getVideoMessages() {
    this.databaseService.endAll = false;
    
    await this.databaseService.getLastKey("videoMessages").then(
      (resp: any) => {
        this.totalDBlength = Number(resp[0].key) || 0;
        // console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("videoMessages", this.totalDBlength).then(
      (res: any) => {

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
        this.storageService.store('videoMessages', res);
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.loadMoreindex = 1;
  }

  doRefresh(event) {
    // window.location.reload();
    this.getVideoMessages();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  loadMoreShowData() {
    this.databaseService.getFbDBpartData("videoMessages", undefined, this.loadMoreindex).then(
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
        this.storageService.store('videoMessages', this.videoMessages);
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

}
