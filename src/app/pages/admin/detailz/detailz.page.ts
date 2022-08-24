import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detailz',
  templateUrl: './detailz.page.html',
  styleUrls: ['./detailz.page.scss'],
})
export class DetailzPage implements OnInit {

  generalForm: FormGroup;
  offeringAcctForm: FormGroup;
  submittedDetails = {
    offeringState: false,
    offeringSent: false,
    generalState: false,
    generalSent: false,
  }

  constructor(
    public formBuilder: FormBuilder, 
    // private router: Router,
    public alertController: AlertController,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit() {
    this.generalForm = this.formBuilder.group({
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

      message: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
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
    await this.databaseService.getRealtimeDBdata("generalDetails").then(
      (res: any) => {
        console.log(res);
        

      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onSubmitGeneralForm() {

  }

  onSubmitOfferingAcct() {

  }

  goback(){
    this.location.back();
  }

}
