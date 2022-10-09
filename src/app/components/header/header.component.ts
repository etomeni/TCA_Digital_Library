import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerData = {
    translucent: true || false,
    firstText_red: "TCA ",
    firstText_white: " Digital Library",
  };

  globalMessage = {
    status: false,
    message: "No internet connection"
  };

  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.databaseService.getRealtimeDBdata("settings/generalMsg").then(
      (res: any) => {
        // console.log(res);
        
        this.globalMessage.message = res.message;
        this.globalMessage.status = res.status;

        this.storageService.store("generalMsg", res);
      },
      (err: any) => {
        console.log(err);

        this.storageService.get("generalMsg").then(
          (res: any) => {
            if (res) {
              this.globalMessage.message = res.message;
              this.globalMessage.status = res.status;
            }
          }
        );
        
      }
    )
  }

}
