import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStore: StorageService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;

    return this.localStore.get("intro").then( res => {
      if (res) {
        this.router.navigateByUrl('/radio', {replaceUrl: true});
        return false;
      } else {
        return true;
      };
    }).catch ( error => {
      return true;
    })
  }
  
}
