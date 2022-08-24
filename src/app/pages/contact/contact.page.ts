import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
// import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { DatabaseService } from 'src/app/services/database.service';
// import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  contactForm: FormGroup;
  submitted = false;
  sent = false;

  totalDBlength: number;

  constructor(
    public formBuilder: FormBuilder, 
    // private router: Router,
    public alertController: AlertController,
    private http: HttpClient,
    // services here
    // private StoreService: StorageService,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
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
    
    this.databaseService.endAll = false;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      try {
        await this.databaseService.getLastKey("contactUs").then(
          (res: any) => {
            // console.log(res);
            this.totalDBlength = Number(res[0].key || -1) || 0;
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
        const contactFormPath = `contactUs/${ this.totalDBlength+1 }`;
        let contactFormData = {
          name: this.contactForm.value.name,
          email: this.contactForm.value.email,
          phoneNumber: this.contactForm.value.phoneNumber,
          message: this.contactForm.value.message,
          id: this.totalDBlength+1,
          date,
          dateTime,
          status: false,
          delete: false
        };

        let mailJSparam = {
          subject: "New Contact Message From " + this.contactForm.value.name,
          from_name: this.contactForm.value.name,
          reply_to: this.contactForm.value.email,
          from_phone_number: this.contactForm.value.phoneNumber,
          before_msg: "",
          message: this.contactForm.value.message,
          after_msg: "",
          to_name: "The Consolation Family",  
        }
        await this.databaseService.saveToRealtimeDataDB(contactFormPath, contactFormData).then( () => {
          this.sent = true;

          // EVERYTHING IS WORKING FIX THE SEND MAIL

          // this.sendMail(this.contactForm.value);
          this.submitted = false;
          // console.log("contact form sent");
        }).catch( err => {
          this.presentAlert("An error ocurred while sending the message");
          this.submitted = false;
          // console.log(err);
        });

      } catch (error) {
        this.presentAlert("Ooops, an error just Orcured, please check your connection and try again.")
        this.submitted = false;
        console.log(error);
      }
    }
  }

  async sendMail(contactFormData: any) {

    let message = "Hello Team TCA, <br><b>" + contactFormData.name + "</b> just contacted us with this message below <br><br>" + 
                  contactFormData.message + "<br><br> Please do well to attend to it on time. <br><br> Thanks. <br> Team TCA";

    let postParam = JSON.stringify({
      receiverEmail: "Sundaywht@gmail.com",
      appName: "TCA Digital Library",
      subject: "Clients's Feedback From " + contactFormData.name,
      userName: contactFormData.name,
      userEmail: contactFormData.email,
      message: contactFormData.message
    });
    
    // const link = 'http://127.0.0.1/sendMailwithIonic/sendMail.php';
    const link = 'https://audiomackstream.com/sendMailwithIonic/sendMail.php';

    let response: any = this.http.post(link, postParam).subscribe( res => {
      console.log(res);      
    });

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

}
