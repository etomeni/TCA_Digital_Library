import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  sent = false;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    // services here
    public storeService: StorageService,
    private databaseService: DatabaseService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
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

      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],

      cPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]

    });
  }


  onSubmit() {
    this.submitted = true;
    if (this.signupForm.valid) {
      try {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        this.databaseService.signupFireAuth(this.signupForm.value).then(
          (response : any) =>  {
            console.log(response);
            if (response.user) {
              response.user.updateProfile({
                displayName: this.signupForm.value.name,
                name: this.signupForm.value.name,
                email: this.signupForm.value.email,
              });

              // save in firebase real time database
              const data2dB = {
                name: this.signupForm.value.name,
                email: this.signupForm.value.email,
                // password: this.signupForm.value.password,
                userID: response.user.uid,
                date,
                time,
                dateTime
              }

              // save in firebase real time database realtimeDB
              this.databaseService.saveToRealtimeDataDB(`users/${response.user.uid}`, data2dB).then( (res: any) => {
                // console.log(res);
                
                this.sent = true;
                this.submitted = false;
                this.presentToast("new admin created successfully!!!");
              }).catch( err => {
                this.presentAlert("an error ocurred while saving user's data");
                this.submitted = false;
                console.log(err);
              });

            } else {
              console.log(response);
              this.submitted = false;
            }

          },
          (err: any) => {
            this.presentAlert("An error ocurred while adding new user or email already in use");
            this.submitted = false;
          }
        ).catch ((error: any)=> {
          this.presentAlert("An error ocurred while adding new user or email already in use");
          this.submitted = false;

          console.log(error);
        });

      } catch (error: any) {
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
    const toast = await this.toastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
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
