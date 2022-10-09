import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

interface bankDetails {
  accountName: string,
  accountNumber: string,
  bankName: string,
}

@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

  bankDetails = {
    accountName: 'Consolation Ministry',
    accountNumber: '0168368717',
    bankName: 'GT Bank',
  }

  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.getBankDetails();
  }

  getBankDetails() {
    this.databaseService.getRealtimeDBdata("generalDetails/bankDetails").then(
      (res: bankDetails) => {
        // console.log(res);
        
        this.bankDetails.accountName = res.accountName;
        this.bankDetails.accountNumber = res.accountNumber;
        this.bankDetails.bankName = res.bankName;

        this.storageService.store("bankDetails", res);
      },
      (err: any) => {
        console.log(err);
        
        this.storageService.get("bankDetails").then(
          (res: any) => {
            if (res) {
              this.bankDetails.accountName = res.accountName;
              this.bankDetails.accountNumber = res.accountNumber;
              this.bankDetails.bankName = res.bankName;
            }
          }
        )
      }
    )
  }

}
