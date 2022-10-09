import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-dev-contact',
  templateUrl: './dev-contact.page.html',
  styleUrls: ['./dev-contact.page.scss'],
})
export class DevContactPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonModal) modal: IonModal;

  contactForm: FormGroup;
  submitted = false;
  sent = false;

  totalDBlength: number;

  devData = {
    image: '/assets/images/devSundayEtom.png',
    name: 'Sunday Etom',
    description: `I'm a full-stack software developer specialised in frontend and backend development for complex scalable apps. I've been developing since 2019, am Keen on learning more, expanding my skills and knowledge, collaborating and sharing knowledge with people.`,
    email: 'sundaywht@gmail.com',
    mailSubject: 'Contacting from TCA Digital Library',
    website: 'sunday.rf.gd',
    phoneNumber: '2348108786933',
    whatsAppLink: '//wa.me/2348108786933',
    facebookLink: 'https://facebook.com/amsundaywhite',
    facebookUsername: '@amsundaywhite',
    instagramLink: 'https://instagram.com/amsundaywhite',
    instagramUsername: '@amsundaywhite',
    twitterLink: 'https://twitter.com/amsundaywhite',
    twitterUsername: '@amsundaywhite',
    linkedinLink: 'https://linkedin.com/in/sunday-white',
    linkedinUsername: '@sunday-white',
    dropMessageState: false
  }

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private location: Location,
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

    this.getDevDetails();
  }

  getDevDetails() {
    this.databaseService.getRealtimeDBdata("devDetails").then(
      (res: any) => {
        // console.log(res);

        if (res.image) {
          this.devData.image = res.image;
        }

        if (res.name) {
          this.devData.name = res.name;
        }

        if (res.description) {
          this.devData.description = res.description;
        }

        if (res.email) {
          this.devData.email = res.email;
        }

        if (res.mailSubject) {
          this.devData.mailSubject = res.mailSubject;
        }

        if (res.website) {
          this.devData.website = res.website;
        }

        if (res.phoneNumber) {
          this.devData.phoneNumber = res.phoneNumber;
        }

        if (res.whatsAppLink) {
          this.devData.whatsAppLink = res.whatsAppLink;
        }

        if (res.facebookLink) {
          this.devData.facebookLink = res.facebookLink;
        }

        if (res.facebookUsername) {
          this.devData.facebookUsername = res.facebookUsername;
        }

        if (res.instagramLink) {
          this.devData.instagramLink = res.instagramLink;
        }

        if (res.instagramUsername) {
          this.devData.instagramUsername = res.instagramUsername;
        }

        if (res.twitterLink) {
          this.devData.twitterLink = res.twitterLink;
        }

        if (res.twitterUsername) {
          this.devData.twitterUsername = res.twitterUsername;
        }

        if (res.linkedinLink) {
          this.devData.linkedinLink = res.linkedinLink;
        }

        if (res.linkedinUsername) {
          this.devData.linkedinUsername = res.linkedinUsername;
        }

      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      try {
        await this.databaseService.getLastKey("devContact").then(
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
        const contactFormPath = `devContact/${ this.totalDBlength+1 }`;
        let contactFormData = {
          name: this.contactForm.value.name,
          email: this.contactForm.value.email,
          phoneNumber: this.contactForm.value.phoneNumber,
          Message: this.contactForm.value.message,
          id: this.totalDBlength+1,
          date,
          dateTime,
        }
   
        this.databaseService.saveToRealtimeDataDB(contactFormPath, contactFormData).then( () => {
          this.sent = true;
          // EVERYTHING IS WORKING FIX THE SEND MAIL

          this.presentAlert("Your Message has been sent to the developer(s) successfully!");
          this.submitted = false;
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

  openContactModal() {
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
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

  doRefresh(event) {
    this.getDevDetails();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }

  goback(){
    this.location.back();
  }
}
