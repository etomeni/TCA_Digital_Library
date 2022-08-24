import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-announcez',
  templateUrl: './announcez.page.html',
  styleUrls: ['./announcez.page.scss'],
})
export class AnnouncezPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  announcementForm: FormGroup;
  createNewAnnouncement = false;
  submitted = false;
  sent = false;

  uploadImgPreview: any;
  imgFile: any;
  imgFileError: boolean = false;
  editState: boolean = false;
  editData: any;

  modalAnnouncement: any;

  announcements: any[] =[];

  loadMoreState: boolean = true;
  loadMoreindex: number = 0;
  totalDBlength: number;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private location: Location
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

    this.announcementForm = this.formBuilder.group({
      image: ['', [
        // Validators.required,
        // Validators.minLength(3)
      ]],
      announcement: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });

    this.getAnnouncement();
  }

  async getAnnouncement() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("announcements").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key || 0);
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

  deleteItem(i: number, item: any) {
    // console.log(i, item);
    this.databaseService.updateRealtimeDBdata(`announcements/${ item.id || i }`, {status: false}).then(
      (res: any) => {
        if (res) {
          this.announcements.splice(i, 1);
          this.presentAlert("announcement deleted successfully!!!");
        }
      },
      (err: any) => {
        console.log(err);
        this.presentAlert("oops an error ocurred!!!");
      }
    );
  }

  editItem(i: number, item: any) {
    // console.log(i, item);
    this.editState = true;
    item.index = i;
    this.editData = item;
    this.announcementForm.get('announcement').setValue(item.description);
    this.uploadImgPreview = item.image;

    this.createNewAnnouncement = true;
  }

  imagePreview(e) {
    // this.imgFile = (e.target as HTMLInputElement).files[0];
    let imgFile = (e.target as HTMLInputElement).files[0];
    
    if(imgFile.size > 500500) {
      this.uploadImgPreview = undefined;
      this.imgFileError = true;

      // console.log("File size should not be more than 500kb");
      this.presentAlert("File size should not be more than 500kb.");
      this.announcementForm.get('image').reset();
    } else {
      this.imgFile = imgFile;

      const reader = new FileReader();
      reader.onload = () => {
        this.uploadImgPreview = reader.result as string;
      }
      reader.readAsDataURL(this.imgFile);
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.editState) {
      try {
        let data2save = {
          image: this.editData.image,
          description: this.announcementForm.value.announcement,
        };

        const announcementDBpath = `announcements/images/${ this.editData.id || this.editData.index }`;
        if (this.imgFile) {
          await this.databaseService.uploadFile2firebase(announcementDBpath, this.imgFile).then(
            (res: any) => {
              data2save.image = res;
            },
            (err: any) => {
              console.log(err);
            }
          );
        }

        this.createNewAnnouncement = true;

        this.databaseService.updateRealtimeDBdata(announcementDBpath, data2save).then( () => {
          // this.sent = true;
          this.submitted = false;
          this.presentAlert("Announcement published successfully!!!");
          this.announcementForm.reset();
          
          this.getAnnouncement();
          this.createNewAnnouncement = false;
        }).catch( err => {
          this.presentAlert("An error ocurred while trying to save to data");
          this.submitted = false;
          console.log(err);
        });
        
      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.");
        this.submitted = false;
        console.log(error);
      }
    } else {
      this.editState = false;

      try {
        await this.databaseService.getLastKey("announcements").then(
          (res: any) => {
            this.totalDBlength = Number(res[0].key || -1);
          },
          (err: any) => {
            console.log(err);
          }
        );

        let imageUrl = "";
        let announcementDBpath = `announcements/images/${this.totalDBlength+1}`;
        if (this.imgFile) {
          await this.databaseService.uploadFile2firebase(announcementDBpath, this.imgFile).then(
            (res: any) => {
              // console.log(res);
              imageUrl = res;
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
        
        var today = new Date();
        // save in firebase real time database
        const data2save = {
          image: imageUrl,
          description: this.announcementForm.value.announcement,
          date: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
          // time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
          id: this.totalDBlength+1,
          status: true,
          dateTime: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()   +' '+  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        };

        this.createNewAnnouncement = true;

        this.databaseService.saveToRealtimeDataDB(announcementDBpath, data2save).then( () => {
          this.sent = true;
          this.submitted = false;
          this.presentAlert("Announcement published successfully!!!");

          this.getAnnouncement();
          this.announcementForm.reset();
        }).catch( err => {
          this.presentAlert("An error ocurred while trying to save to data");
          this.submitted = false;
          console.log(err);
        });
        
      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.");
        this.submitted = false;
        console.log(error);
      }
    }
  }


  addNewBTN() {
    this.createNewAnnouncement = true;
  }

  closeAddNewBTN() {
    this.createNewAnnouncement = false;
  }

  loadMoreShowData() {
    this.databaseService.getFbDBpartData("announcements", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);

        if(res.length < 1) {
          this.loadMoreState = false;
        }
   
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
        }

        this.announcements = [...this.announcements, ...res];
        // this.storageService.store('announcements', this.announcements);
      },
      (err: any) => {
        console.log(err);
        // reject(err)
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

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  doRefresh(event) {
    window.location.reload();
    // this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  goback(){
    this.location.back();
  }


  openViewModal(item: any) {
    this.modalAnnouncement = item;

    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}