import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
// import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.page.html',
  styleUrls: ['./prayer-request.page.scss'],
})
export class PrayerRequestPage implements OnInit {

  prayerRequestForm: FormGroup;
  submitted = false;
  sent = false;

  totalDBlength: number = 0;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    // private http: HttpClient,
    // services here
    // public storageService: StorageService,
    private databaseService: DatabaseService,
    private ToastController: ToastController,
  ) { }

  ngOnInit() {
    this.prayerRequestForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
        Validators.email
      ]],

      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[0-9+]+$'),
      ]],

      message: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]

    });

    this.databaseService.endAll = false;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.prayerRequestForm.valid) {
      try {
        await this.databaseService.getLastKey("prayerRequests").then(
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
        const prayerRequestFormData = {
          name: this.prayerRequestForm.value.name,
          email: this.prayerRequestForm.value.email,
          phoneNumber: this.prayerRequestForm.value.phoneNumber,
          message: this.prayerRequestForm.value.message,
          id: this.totalDBlength+1,
          status: false,
          date,
          dateTime,
        }
        
        await this.databaseService.saveToRealtimeDataDB(`prayerRequests/${this.totalDBlength+1}`, prayerRequestFormData).then( () => {
          this.sent = true;
          this.presentAlert("Your prayer request has been sent successfully!!!");
          this.submitted = false;
        }).catch( err => {
          this.presentAlert("An error ocurred while sending the message");
          this.submitted = false;
          console.log(err);
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.")
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

  async presentToast(message) {
    const toast = await this.ToastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.ToastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      icon: 'information-circle',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
