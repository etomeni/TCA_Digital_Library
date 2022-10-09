import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-live-tv',
  templateUrl: './live-tv.page.html',
  styleUrls: ['./live-tv.page.scss'],
})
export class LiveTVPage implements OnInit {
  loadingStatus: boolean = false;
  
  tvStatus: boolean = false;
  goLiveForm: FormGroup;

  goLiveFormState = {
    sent: false,
    submitted: false
  }

  constructor(
    public formBuilder: FormBuilder, 
    // private router: Router,
    public alertController: AlertController,
    private databaseService: DatabaseService,
    private storeService: StorageService,
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

    // let intervals = setInterval(() => {
    //   // console.log('Internet Connection is disconnected :-(');
    //   this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
    // }, 20000);

    // clearInterval(intervals);

  }

  async getLiveStreamState() {
    this.storeService.get("live").then(
      (res: any) => {
        if (res) {
          console.log(res);
          
        }
      },
      (err: any) => {
        // console.log(err);
      }
    )

    await this.databaseService.getRealtimeDBdata("live").then(
      (res: any) => {
        // console.log(res);
        this.loadingStatus = true;

        this.tvStatus = res[0].tvStatus;

        // this.storeService.store("live", res);
      },
      (err: any) => {
        // console.log(err);
      }
    );
  }

  onSubmitGoLive() {
    console.log(this.goLiveForm.value);
    
    this.goLiveForm.value.streamUrl = this.goLiveForm.value.streamUrl.replace(/width=".*?"/i, `width"100%"`).replace(/height=".*?"/i, `height"auto"`);
    
    console.log(this.goLiveForm.value.streamUrl);
  }

  endLiveStreamBtn() {

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
  
  goback(){
    this.location.back();
  }
}