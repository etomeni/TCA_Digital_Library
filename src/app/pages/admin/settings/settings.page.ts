import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  generalMsgForm: FormGroup;
  appUpdateForm: FormGroup;

  submittedDetails = {
    generalMsgForm: {
      state: false,
      sent: false
    },

    appUpdateForm: {
      state: false,
      sent: false
    }
  };

  offeringPageState: boolean;
  generalNotificationMsgState: boolean;
  appUpdateData: any;
  settingsData: any;

  onChangeAppUpdateState: boolean;
  onChangeAppUpdateMajor: boolean;

  userOnClick: boolean = false;

  constructor(
    public formBuilder: FormBuilder, 
    // private router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    private databaseService: DatabaseService,
    private storageService: StorageService,
    private location: Location
  ) { }

  ngOnInit() {
    this.generalMsgForm = this.formBuilder.group({
      message: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]

    });

    this.appUpdateForm = this.formBuilder.group({
      iOSappID: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      androidAppID: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      iOSappVersion: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      androidAppVersion: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],

      updateBtn: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],

      updateTitle: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],

      updateMessage: ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
    });

    this.getSettingsData();

  }

  getSettingsData() {
    this.databaseService.getRealtimeDBdata("settings").then(
      (res: any) => {
        // console.log(res);
        this.settingsData = res;
        this.storageService.store("settings", res);

        this.offeringPageState = res.showOfferingPage ? true : false;
        this.generalNotificationMsgState = res.generalMsg.status ? true : false;

        this.generalMsgForm.setValue({ message: res.generalMsg.message });

        const setAppUpdateForm = {
          androidAppID: res.update.appID.android || '',
          iOSappID: res.update.appID.iOS || '',
          iOSappVersion: res.update.currentAppVersion.iOS || '',
          androidAppVersion: res.update.currentAppVersion.android || '',
          updateBtn: res.update.displayText.btn || '',
          updateMessage: res.update.displayText.message || '',
          updateTitle: res.update.displayText.title || ''
        };
        this.appUpdateForm.setValue(setAppUpdateForm);

        this.onChangeAppUpdateState = res.update.status ? true : false;
        this.onChangeAppUpdateMajor = res.update.forceful ? true : false;

        this.appUpdateData = res.update;
      },
      (err: any) => {
        console.log(err);

        this.storageService.get("settings").then(
          (res: any) => {
            if (res) {
              // console.log(res);
              this.settingsData = res;
              this.storageService.store("settings", res);

              this.offeringPageState = res.showOfferingPage ? true : false;
              this.generalNotificationMsgState = res.generalMsg.status ? true : false;

              this.generalMsgForm.setValue({ message: res.generalMsg.message });

              const setAppUpdateForm = {
                androidAppID: res.update.appID.android || '',
                iOSappID: res.update.appID.iOS || '',
                iOSappVersion: res.update.currentAppVersion.iOS || '',
                androidAppVersion: res.update.currentAppVersion.android || '',
                updateBtn: res.update.displayText.btn || '',
                updateMessage: res.update.displayText.message || '',
                updateTitle: res.update.displayText.title || ''
              };
              this.appUpdateForm.setValue(setAppUpdateForm);

              this.onChangeAppUpdateState = res.update.status ? true : false;
              this.onChangeAppUpdateMajor = res.update.forceful ? true : false;

              this.appUpdateData = res.update;
            }
          }
        );
        
      }
    );
  }

  onSubmitGeneralMsgForm() {
    const formValue = this.generalMsgForm.value;
    // console.log(formValue.message);

    this.submittedDetails.generalMsgForm.state = true;

    this.databaseService.updateRealtimeDBdata("settings/generalMsg", {message: formValue.message}).then(
      (res: any) => {
        // console.log(res);
        this.submittedDetails.generalMsgForm.sent = true;
        setTimeout(() => {
          this.submittedDetails.generalMsgForm.sent = false;
        }, 20000);

        // No internet connection
          
        this.presentToast("Success", "General notification message now enabled.");
        this.submittedDetails.generalMsgForm.state = false;
      },
      (err: any) => {
        console.log(err);
        this.presentToast("Error", "ooops! an error occured");

        this.submittedDetails.generalMsgForm.state = false;
        this.offeringPageState = this.settingsData.showOfferingPage ? true : false;
      }
    );
  }

  onSubmitAppUpdate() {
    this.submittedDetails.appUpdateForm.state = true;
    const formValue = this.appUpdateForm.value;
    // console.log(formValue.message);

    const data2submit = {
      currentAppVersion: {
        android: formValue.androidAppVersion,
        iOS: formValue.iOSappVersion
      },

      displayText: {
        btn: formValue.updateBtn,
        message: formValue.updateMessage,
        title: formValue.updateTitle
      },

      forceful: this.onChangeAppUpdateMajor,
      status: this.onChangeAppUpdateState
    }

    this.databaseService.updateRealtimeDBdata("settings/update", data2submit).then(
      (res: any) => {
        // console.log(res);
        this.submittedDetails.appUpdateForm.sent = true;
        setTimeout(() => {
          this.submittedDetails.appUpdateForm.sent = false;
        }, 20000);

        this.presentToast("Success", "New app update has been sent to users.");
        this.submittedDetails.appUpdateForm.state = false;
      },
      (err: any) => {
        console.log(err);
        this.presentToast("Error", "ooops! an error occured");

        this.submittedDetails.appUpdateForm.state = false;
        this.onChangeAppUpdateState = this.settingsData.update.status ? true : false;
        this.onChangeAppUpdateMajor = this.settingsData.update.forceful ? true : false;
      }
    );
    
  }

  enableOfferingPage(e: any) {
    const value = e.detail.checked;
    this.offeringPageState = value ? true : false;
    // console.log(value);

    this.databaseService.updateRealtimeDBdata("settings", {showOfferingPage: value}).then(
      (res: any) => {
        // console.log(res);
        if (this.userOnClick) {
          this.presentToast("Success", "Offering Page Now Visible to all");
        }
      },
      (err: any) => {
        console.log(err);
        if (this.userOnClick) {
          this.presentToast("Error", "ooops! an error occured");
        }
        this.offeringPageState = this.settingsData.showOfferingPage ? true : false;
      }
    );

  }

  generalNotificationMsg(e: any) {
    const value = e.detail.checked;
    this.generalNotificationMsgState = value ? true : false;
    // console.log(value);

    const submittedData: any = {
      status: value
    };

    if (!value) {
      submittedData.message = '';
    };

    this.databaseService.updateRealtimeDBdata("settings/generalMsg", submittedData).then(
      (res: any) => {
        // console.log(res);
        // if (this.userOnClick) {
        //   this.presentToast("Success", "Offering Page Now Visible to all");
        // }
      },
      (err: any) => {
        console.log(err);
        // if (this.userOnClick) {
        //   this.presentToast("Error", "ooops! an error occured");
        // }
        this.offeringPageState = this.settingsData.showOfferingPage ? true : false;
      }
    );

  }

  appUpdateStateOnChange(e: any) {
    const value = e.detail.checked;
    this.onChangeAppUpdateState = value ? true : false;
    // console.log(value);
  }

  appUpdateMajorOnChange(e: any) {
    const value = e.detail.checked;
    this.onChangeAppUpdateMajor = value ? true : false;
    // console.log(value);
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

  onClick(e: any ) {
    // console.log(e);
    this.userOnClick = true;
    
    setTimeout(() => {
      this.userOnClick = false;
    }, 20000);
  };

  goback(){
    this.location.back();
  }


}
