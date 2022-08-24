import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  dashboardExtra: any = {
    topLink: this.sanitizer.bypassSecurityTrustHtml(''),
    bottomLink: this.sanitizer.bypassSecurityTrustHtml(''),
    topStatus: false,
    bottomStatus: false
  };


  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }


  doRefresh(event) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
