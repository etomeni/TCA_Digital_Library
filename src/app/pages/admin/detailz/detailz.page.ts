import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-detailz',
  templateUrl: './detailz.page.html',
  styleUrls: ['./detailz.page.scss'],
})
export class DetailzPage implements OnInit {

  generalForm: FormGroup;
  pstDetailsForm: FormGroup;
  offeringAcctForm: FormGroup;
  submittedDetails = {
    offeringState: false,
    offeringSent: false,
    generalState: false,
    generalSent: false,
    pastorFormState: false,
    pastorFormSent: false,
  };


  generalDetails = {
    appName: "TCA Digital Library",
    churchEmail: "churchEmail@gmail.com",
    churchName: "The Comforter's Assembly",

    bankDetails: {
      accountName: "Sunday Etom Eni",
      accountNumber: 2047661929,
      name: "United Bank for Africa"
    },

    facebookLink: "https://facebook.com/consolationministry",
    facebookUsername: "consolationministry",

    instagramLink: "https://www.instagram.com/comfortersfamily",
    instagramUsername: "comfortersfamily",
    
    // youtubeLink: "https://www.youtube.com/channel/UCGHt9n_lS15uxRuinnl_ddA",
    youtubeLink: "",
    youtubeUsername: "",

    pastorTitle: "Pst.",
    pastorName: "Uzor Echiejile ",
    assistantPastorName: " ghjb",
    pastorEmail: "pastorEmail@gmail.com",
    pastorNumber: 2347048274813,
    pastorNumberAlt:2347057398469,
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
    this.generalForm = this.formBuilder.group({
      appName: [ {value: '', disabled: true }, [
        Validators.required,
        Validators.minLength(3)
      ]],

      churchName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      churchEmail: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$'),
      ]],

      facebookLink: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      instagramLink: ['', [
        // Validators.required,
        Validators.minLength(3)
      ]],

      youtubeLink: ['', [
        // Validators.required,
        Validators.minLength(3)
      ]],
    });

    this.pstDetailsForm = this.formBuilder.group({
      pastorTitle: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      pastorName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      assistantPastorName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      pastorEmail: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$'),
      ]],

      pastorNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        // Validators.pattern('^[0-9+]+$'),
      ]],

      pastorNumberAlt: ['', [
        Validators.required,
        Validators.minLength(10),
        // Validators.pattern('^[0-9+]+$'),
      ]],
    });

    this.offeringAcctForm = this.formBuilder.group({
      bankName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      accountName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      accountNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
    });

    this.getGeneralDetails();
  }

  async getGeneralDetails() {
    this.storeService.get("generalDetails").then(
      (res: any) => {
        if (res) {
          this.generalDetails = res;

          this.generalForm.get("appName").setValue(res.appName);
          this.generalForm.get("churchName").setValue(res.churchName);
          this.generalForm.get("churchEmail").setValue(res.churchEmail);
          this.generalForm.get("facebookLink").setValue(res.facebookLink);
          this.generalForm.get("instagramLink").setValue(res.instagramLink);
          this.generalForm.get("youtubeLink").setValue(res.youtubeLink);

          this.pstDetailsForm.get("pastorTitle").setValue(res.pastorTitle);
          this.pstDetailsForm.get("pastorName").setValue(res.pastorName);
          this.pstDetailsForm.get("assistantPastorName").setValue(res.assistantPastorName);
          this.pstDetailsForm.get("pastorEmail").setValue(res.pastorEmail);
          this.pstDetailsForm.get("pastorNumber").setValue(res.pastorNumber);
          this.pstDetailsForm.get("pastorNumberAlt").setValue(res.pastorNumberAlt);

          this.offeringAcctForm.get("bankName").setValue(res.bankDetails.name);
          this.offeringAcctForm.get("accountName").setValue(res.bankDetails.accountName);
          this.offeringAcctForm.get("accountNumber").setValue(res.bankDetails.accountNumber);
        }
      },
      (err: any) => {
        // console.log(err);
      }
    )

    await this.databaseService.getRealtimeDBdata("generalDetails").then(
      (res: any) => {
        // console.log(res);

        this.generalDetails = res;
        this.storeService.store("generalDetails", res);

        this.generalForm.get("appName").setValue(res.appName);
        this.generalForm.get("churchName").setValue(res.churchName);
        this.generalForm.get("churchEmail").setValue(res.churchEmail);
        this.generalForm.get("facebookLink").setValue(res.facebookLink);
        this.generalForm.get("instagramLink").setValue(res.instagramLink);
        this.generalForm.get("youtubeLink").setValue(res.youtubeLink);

        this.pstDetailsForm.get("pastorTitle").setValue(res.pastorTitle);
        this.pstDetailsForm.get("pastorName").setValue(res.pastorName);
        this.pstDetailsForm.get("assistantPastorName").setValue(res.assistantPastorName);
        this.pstDetailsForm.get("pastorEmail").setValue(res.pastorEmail);
        this.pstDetailsForm.get("pastorNumber").setValue(res.pastorNumber);
        this.pstDetailsForm.get("pastorNumberAlt").setValue(res.pastorNumberAlt);

        this.offeringAcctForm.get("bankName").setValue(res.bankDetails.name);
        this.offeringAcctForm.get("accountName").setValue(res.bankDetails.accountName);
        this.offeringAcctForm.get("accountNumber").setValue(res.bankDetails.accountNumber);

      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async onSubmitGeneralForm() {
    this.submittedDetails.generalState = true;
    if (this.generalForm.valid) {
      try {
        this.generalForm.value.facebookUsername = this.generalForm.value.facebookLink.split('.com/')[1] || this.generalDetails.facebookUsername;
        this.generalForm.value.instagramUsername = this.generalForm.value.instagramLink.split('.com/')[1] || this.generalDetails.instagramUsername;
        this.generalForm.value.youtubeUsername = this.generalForm.value.youtubeLink.split('.com/channel/')[1] || '';
    
        // console.log(this.generalForm.value);
    
        await this.databaseService.updateRealtimeDBdata(`generalDetails`, this.generalForm.value).then( () => {
          this.submittedDetails.generalSent = true;

          this.presentAlert("Details updated successfully!");
          this.submittedDetails.generalState = false;

          setTimeout(() => {
            this.submittedDetails.generalSent = false;
          }, 15000);

        }).catch( err => {
          this.presentAlert("An error ocurred while saving changes");
          this.submittedDetails.generalState = false;
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.")
        this.submittedDetails.generalState = false;
        console.log(error);
      }
    }
  }

  async onSubmitPstDetailsForm() {
    this.submittedDetails.pastorFormState = true;
    if (this.pstDetailsForm.valid) {
      try {
        // console.log(this.pstDetailsForm.value);
    
        await this.databaseService.updateRealtimeDBdata(`generalDetails`, this.pstDetailsForm.value).then( () => {
          this.submittedDetails.pastorFormSent = true;

          this.presentAlert("Pastor's details have been updated successfully!");
          this.submittedDetails.pastorFormState = false;

          setTimeout(() => {
            this.submittedDetails.pastorFormSent = false;
          }, 15000);

        }).catch( err => {
          this.presentAlert("An error ocurred while saving changes");
          this.submittedDetails.pastorFormState = false;
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.")
        this.submittedDetails.pastorFormState = false;
        console.log(error);
      }
    }
  }

  async onSubmitOfferingAcct() {
    this.submittedDetails.offeringState = true;
    if (this.offeringAcctForm.valid) {
      try {
        // console.log(this.offeringAcctForm.value);
    
        await this.databaseService.updateRealtimeDBdata(`generalDetails`, this.offeringAcctForm.value).then( () => {
          this.submittedDetails.offeringSent = true;

          this.presentAlert("Account details has been updated successfully!");
          this.submittedDetails.offeringState = false;

          setTimeout(() => {
            this.submittedDetails.offeringSent = false;
          }, 15000);

        }).catch( err => {
          this.presentAlert("An error ocurred while saving changes");
          this.submittedDetails.offeringState = false;
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.")
        this.submittedDetails.offeringState = false;
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

  goback(){
    this.location.back();
  }

}
