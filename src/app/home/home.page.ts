import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { IonicSlides } from '@ionic/angular';

import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, EffectFade } from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, EffectFade, IonicSlides]);

declare var document;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // private slides: any;
  getStartedBTN: boolean = false;

  constructor(
    private router: Router,
    private StorageService: StorageService
  ) {}

  nextSlide() {
    let swiper = document.querySelector(".swiper").swiper;
    swiper.slideNext();
  }

  getStarted() {
    this.getStartedBTN = true;
    this.StorageService.store("intro", true);
    this.router.navigateByUrl('/radio', {replaceUrl: true});
  }



}