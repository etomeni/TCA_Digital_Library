import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, IonInfiniteScroll } from '@ionic/angular';

import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-testimony',
  templateUrl: './testimony.page.html',
  styleUrls: ['./testimony.page.scss'],
})
export class TestimonyPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  loadingStatus: boolean = false;

  testimonyForm: FormGroup;
  submitted = false;
  sent = false;
  shareTestimony = false;

  loadMoreindex: number = 0;
  loadMoreState: boolean = true;
  totalDBlength: number;

  testimonies: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    // private http: HttpClient,
    // services here
    private storageService: StorageService,
    private databaseService: DatabaseService
  ) { }

  // TODO::::
  // ADMIN MUST ADD TITLES  to testimonies before approving;

  ngOnInit() {
    this.storageService.get('testimonies').then(
      (res: any) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
       
            if (element.testimony.length > 300) {
              res[i].readMore = true;
              res[i].message = element.testimony.slice(0, 300);
            } else {
              res[i].readMore = false;
              res[i].message = element.testimony;
            }
            
            if (element.status == false || element.delete) {
              res.splice(i, 1); 
              i--;
            }
          }

          this.testimonies = res;
          this.loadingStatus = true;
        }
      }
    );

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
      
            if (element.testimony.length > 300) {
              res[i].readMore = true;
              res[i].message = element.testimony.slice(0, 300);
            } else {
              res[i].readMore = false;
              res[i].message = element.testimony;
            }

            if (element.status == false || element.delete) {
              res.splice(i, 1); 
              i--;
            }
          }
        }

        this.testimonies = res;
        this.loadingStatus = true;
        this.storageService.store('testimonies', this.testimonies);
      },
      (err: any) => {
        console.log(err);
      }
    );

    // this.testimonies.forEach(testimony => {
    //   if (testimony.testimony.length > 300) {
    //     testimony.readMore = true;
    //     testimony.message = testimony.testimony.slice(0, 300);
    //   } else {
    //     testimony.readMore = false;
    //     testimony.message = testimony.testimony;
    //   }
    // });

    this.loadMoreindex = 1;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.testimonyForm.valid) {
      try {
        await this.databaseService.getLastKey("testimonies").then(
          (res: any) => {
            this.totalDBlength = Number(res[0].key) || 0;
            // console.log(res);
          },
          (err: any) => {
            console.log(err);
          }
        );

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        // save in firebase real time database
        let testimonyFormPath = `testimonies/${this.totalDBlength+1}`;
        let testimonyFormData = {
          name: this.testimonyForm.value.name,
          phoneNumber: this.testimonyForm.value.phoneNumber,
          testimony: this.testimonyForm.value.testimony,
          email: this.testimonyForm.value.email,
          id: this.totalDBlength+1,
          status: false,
          delete: false,
          date,
          dateTime
        }
        
        this.databaseService.saveToRealtimeDataDB(testimonyFormPath, testimonyFormData).then( () => {
          this.sent = true;

          this.presentAlert("Hallelujah!!!, your testimony has been received!");
          this.submitted = false;
          this.testimonyForm.reset();
        }).catch( err => {
          this.presentAlert("An error ocurred while submitting your testimony");
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

  shareTestimonyBTN() {
    this.shareTestimony = true;
  }

  closeTestimonyBTN() {
    this.shareTestimony = false;
  }

  readMoreBTN(i) {
    this.testimonies[i].readMore = false;
    this.testimonies[i].message = this.testimonies[i].testimony;
  }


  doRefresh(event) {
    this.getTestimonies();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
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

            if (element.testimony.length > 300) {
              res[i].readMore = true;
              res[i].message = element.testimony.slice(0, 300);
            } else {
              res[i].readMore = false;
              res[i].message = element.testimony;
            }

            if (element.status == false || element.delete) {
              res.splice(i, 1); 
              i--;
            }

          }
        }

        this.testimonies = [...this.testimonies, ...res];
        this.storageService.store('testimonies', this.testimonies);
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
