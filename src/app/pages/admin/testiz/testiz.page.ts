import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-testiz',
  templateUrl: './testiz.page.html',
  styleUrls: ['./testiz.page.scss'],
})
export class TestizPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  loadingStatus: boolean = false;

  testimonyForm: FormGroup;
  submitted = false;
  sent = false;
  editTestimony = false;

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  testimonies: any = [];
  modalTestimony: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit() {
    this.testimonyForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
      ]],

      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[0-9+]+$'),
      ]],

      testimony: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]

    });

    this.getTestimonies();
  }

  async getTestimonies() {
    this.databaseService.endAll = false;

    await this.databaseService.getLastKey("testimonies").then(
      (res: any) => {
        this.totalDBlength = Number(res[0].key) || 0;
        // console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.databaseService.getFbDBpartData("testimonies", this.totalDBlength).then(
      (res: any) => {
        // console.log(res);
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
      
            res[i].message = element.testimony;

            if (element.delete) {
              res.splice(i, 1); 
              i--;
            }
          }
        }

        this.testimonies = res;
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
    if (this.testimonyForm.valid) {
      try {
        // save in firebase real time database
        let testimonyFormPath = `testimonies/${ this.modalTestimony.id || this.modalTestimony.index }`;
        const testimonyFormData = {
          name: this.testimonyForm.value.name,
          testimony: this.testimonyForm.value.testimony,
        }
        
        this.databaseService.updateRealtimeDBdata(testimonyFormPath, testimonyFormData).then( () => {
          this.sent = true;

          this.presentAlert("Hallelujah!!! testimony has been corrected & updated!");
          this.submitted = false;
          this.testimonyForm.reset();
          this.getTestimonies();

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
    this.databaseService.updateRealtimeDBdata(`testimonies/${ item.id || i }`, { status: false, delete: true }).then(
      (res: any) => {
        if (res) {
          this.testimonies.splice(i, 1);
          this.presentAlert("testimony deleted successfully!!!");
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
    this.editTestimony = true;

    this.testimonyForm.get('name').setValue(item.name);
    this.testimonyForm.get('email').setValue(item.email);
    this.testimonyForm.get('phoneNumber').setValue(item.phoneNumber);
    this.testimonyForm.get('testimony').setValue(item.testimony);

    this.openViewModal(i, item);
  }

  loadMoreShowData() {
    this.databaseService.getFbDBpartData("testimonies", undefined, this.loadMoreindex).then(
      (res: any) => {
        // console.log(res);
        if(res.length < 1) {
          this.loadMoreState = false;
        } else {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];

            res[i].message = element.testimony;

            if (element.delete) {
              res.splice(i, 1); 
              i--;
            }

          }
        }

        this.testimonies = [...this.testimonies, ...res];
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
    this.getTestimonies();

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
    this.modalTestimony = item;

    this.modal.present();
  }

  approve(item: any) {
    this.submitted = true;

    let testimonyFormPath = `testimonies/${ item.id || item.index || this.modalTestimony.id || this.modalTestimony.index }`;
    
    this.databaseService.updateRealtimeDBdata(testimonyFormPath, { status: true }).then( () => {
      this.presentAlert("Testimony has been approved & now vissible to everyone!");
      this.submitted = false;

      this.testimonies[`${ item.index || this.modalTestimony.index || item.id || this.modalTestimony.id }`].status = true;

      this.cancel();
    }).catch( err => {
      this.presentAlert("An error ocurred while Approving this testimony");
      this.submitted = false;
      console.log(err);
    });

    this.cancel();
  }

  cancel() {
    this.editTestimony = false;
    this.modal.dismiss(null, 'cancel');
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
