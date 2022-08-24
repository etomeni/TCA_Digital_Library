import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
  ) { }

  async store (storageKey: string, value: any) {
    const encryptedvalue = btoa(escape(JSON.stringify(value)))
    return await this.storage.set(storageKey, encryptedvalue);
  }

  async get(storageKey:string) {
    return new Promise(resolve=>{
      this.storage.get(storageKey).then((value)=>{
        if (value == null) {
          resolve(false);
        } else {
          resolve(JSON.parse(unescape(atob(value))));
        }
      })
    })
  }

  async removeItem(storageKey:string) {
    await this.storage.remove(storageKey);
  }
  
  async clear () {
    await this.storage.clear();
  }
}
