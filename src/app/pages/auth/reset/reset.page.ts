import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  sent = false;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    // services here
    public storeService: StorageService,
    private firebaseDataBase: DatabaseService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
        Validators.email
      ]]
    });

  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.valid) {
      try {
        this.firebaseDataBase.sendPasswordResetEmail(this.resetForm.value.email).then(
          (res: any) => {
            this.sent = true;

            this.submitted = false;
            this.presentToast("A password reset link has been sent to your email, check and follow the link to reset your password");
          },
          (err: any) => {
            this.presentAlert("Ooh! an error just occured. There is no user record corresponding to this email.");
            this.submitted = false;
          }
        ).catch((err: any) => {
          this.presentAlert("Ooh! an error just occured. There is no user record corresponding to this email.");
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
