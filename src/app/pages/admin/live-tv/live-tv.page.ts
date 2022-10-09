import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { DatabaseService } from 'src/app/services/database.service';
import { AlertController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-live-tv',
  templateUrl: './live-tv.page.html',
  styleUrls: ['./live-tv.page.scss'],
})
export class LiveTVPage implements OnInit {
  loadingStatus: boolean = false;
  
  tvStatus: boolean = false;
  tvLink: any;
  goLiveForm: FormGroup;

  goLiveFormState = {
    sent: false,
    submitted: false,
    endBtn: false
  }

  constructor(
    public formBuilder: FormBuilder, 
    // private router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    private databaseService: DatabaseService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) { }

  ngOnInit() {
    this.goLiveForm = this.formBuilder.group({
      streamUrl: [ {value: '', disabled: false }, [
        Validators.required,
        Validators.minLength(3)
      ]],

    });

    this.getLiveStreamState();
  }

  async getLiveStreamState() {
    await this.databaseService.getRealtimeDBdata("live").then(
      (res: any) => {
        // console.log(res);
        this.loadingStatus = true;

        this.tvStatus = res[0].tvStatus;
        this.tvLink = this.sanitizer.bypassSecurityTrustHtml(res[0].tv);

        this.storageService.store("live", res);
      },
      (err: any) => {
        // console.log(err);
        this.storageService.get("live").then(
          (res: any) => {
            if (res) {
              this.loadingStatus = true;

              this.tvStatus = res[0].tvStatus;
              this.tvLink = this.sanitizer.bypassSecurityTrustHtml(res[0].tv);
            }
          }
        )
      }
    );
  }

  onSubmitGoLive() {
    this.goLiveFormState.submitted = true;
    
    this.goLiveForm.value.streamUrl = this.goLiveForm.value.streamUrl.replace(/width=".*?"/i, `width"100%"`).replace(/height=".*?"/i, `height"auto"`);
    // console.log(this.goLiveForm.value.streamUrl);

    const data2send = {
      tv: this.goLiveForm.value.streamUrl,
      tvStatus: true
    }

    this.databaseService.updateRealtimeDBdata("live/0", data2send).then(
      (res: any) => {
        this.goLiveFormState.sent = true;
        setTimeout(() => {
          this.goLiveFormState.sent = false;
        }, 20000);

        this.tvLink = this.sanitizer.bypassSecurityTrustHtml(this.goLiveForm.value.streamUrl);

        this.presentToast("Success", "Live Streaming View is now ON");

        this.tvStatus = true;
        this.goLiveFormState.submitted = false;
      },
      (err: any) => {
        console.log(err);
        
        this.presentToast("Error", "ooops! an error occured");
        this.goLiveFormState.submitted = false;
      }
    )
  }

  endLiveStreamBtn() {
    this.goLiveFormState.endBtn = true;

    const data2send = {
      tv: ' ',
      tvStatus: false
    }

    this.databaseService.updateRealtimeDBdata("live/0", data2send).then(
      (res: any) => {
        this.presentToast("Success", "Live TV viewing disabled");

        this.tvStatus = false;
        this.goLiveFormState.endBtn = false;
      },
      (err: any) => {
        console.log(err);
        
        this.presentToast("Error", "ooops! an error occured");
        this.goLiveFormState.endBtn = false;
      }
    )
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

  async presentToast(header: string, message: string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 10000, // 10 seconds
      position: 'top', // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }
  
  goback(){
    this.location.back();
  }
}