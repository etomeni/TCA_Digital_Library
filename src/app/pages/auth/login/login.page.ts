import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  error: any = {
    status: false,
    message: ''
  };
  loginForm: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    // services here
    public storeService: StorageService,
    private databaseService: DatabaseService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]

    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      try {
        const formDataValue = this.loginForm.value;
        // console.log(formDataValue);
        
        this.databaseService.loginFireAuth(formDataValue).then(
          (res: any) => {
            let userInf = res.user.multiFactor.user;

            this.databaseService.userDBinfo(userInf.uid).then(
              (resp: any)=>{
                let userData = {
                  userLoginInfo: userInf,
                  userDBinfo: resp,
                  loginStatus: true
                }
                this.storeService.store("user", userData);
                this.submitted = false;
                this.router.navigateByUrl('/admin', {replaceUrl: true});
              },
              (err: any)=>{
                this.submitted = false;
                this.presentToast("unable to get user's data");

                console.log(err);
              }
            );

            this.presentToast("successfull!!!");
          },
          (err: any) => {
            this.error.status = true;
            this.error.message = "Incorrect email address or password.";
            this.presentToast("Incorrect email address or password.");
            this.submitted = false;
            console.log(err);
          }
        ).catch( err => {
          this.error.status = true;
          this.error.message = "Incorrect email address or password.";
          this.presentAlert("Incorrect email address or password.");
          this.submitted = false;
          console.log(err);
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just occured while trying to log you in, please check your connection and try again.")
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
