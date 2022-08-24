import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
 
export interface Note {
  id?: string;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  totalQdb: number;
  // startAt: number = 0;
  endAll: boolean = false;
  
  constructor(
    private realtimeDB: AngularFireDatabase,
    private firebaseStorage: AngularFireStorage,
    public auth: AngularFireAuth
  ) { }


  // getMultipleDBdata(path: string): Observable<Note[]> {
  //   const notesRef = collection(this.firestore, path);
  //   return collectionData(notesRef) as Observable<Note[]>;
  // }

  // getDBdataById(path: string, id): Observable<Note> {
  //   const noteDocRef = doc(this.firestore, `notes/${id}`);
  //   return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  // }

  // async getFirestore(path: string) {
  //   try {
  //     const querySnapshot = await getDocs(collection(this.firestore, path));
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => ${doc.data()}`);
  //     });
  //   } catch (error) {
  //     return error;
  //     console.error("Error adding document: ", error);
  //   }
    
  // }
 
  // addToDB(path: string, data: any) {
  //   try {
  //     const collectionRef = collection(this.firestore, path);
  //     const docRef: any = addDoc(collectionRef, data);
  //     return docRef;
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (error) {
  //     return error;
  //     console.error("Error adding document: ", error);
  //   }
  // }
 
  // deleteDb(path: string) {
  //   try {
  //     const docRef = doc(this.firestore, path);
  //     return deleteDoc(docRef);
  //     // await deleteDoc(doc(this.firestore, "cities", "DC"));
  //   } catch (error) {
  //     return error;
  //     console.error("Error updating document: ", error);
  //   }
  // }
 
  // updateDB(path: string, dataObj: any) {
  //   try {
  //     const noteDocRef = doc(this.firestore, path);
  //     const updateDb = updateDoc(noteDocRef, dataObj);
  //     return updateDb;
  //   } catch (error) {
  //     return error;
  //     console.error("Error updating document: ", error);
  //   }
  // }


  // THE FOLLOWING IS FOR THE COMPACTIBLE REALTIME DATABASE
  

  getLastKey(path:any){
    let dbPath = this.realtimeDB.database.ref(path);

    return new Promise<any> ((resolve, reject) => {
      this.realtimeDB.list(dbPath, ref =>
        ref.orderByKey().limitToLast(1)).snapshotChanges().subscribe (
          (res: any) => {
            if (res.length) {
              this.totalQdb = Number(res[0].key);
            }
            resolve(res);
          },
          (err: any) => {
            reject(err);
            // console.log(err);
          }
      )
    })

  }

  async getFbDBpartData(path:any, totalDBlength=this.totalQdb, start=0, size=10) {
    // get data in bits as an array

    let dbPath = this.realtimeDB.database.ref(path);
    let dbLength = totalDBlength || this.totalQdb;

    let end_at: number;
    let start_at: number;
    let next_start_size: number = ((start+1)*size);

    if (start == 0) {
      if (dbLength <= size) {
        this.endAll = true;
      }

      return new Promise<any> ((resolve, reject) => {
        this.realtimeDB.list(dbPath, ref =>
        ref.orderByKey().limitToLast(size)).valueChanges().subscribe (
          res=>resolve(res.reverse()),
          error=>reject(error)
        )
      });
    } else {
      
      if (next_start_size >= dbLength && this.endAll == false) {
        // let remaingSize = dbLength % (next_start_size - size) + 1;
        let remaingSize: number;

        if (next_start_size == dbLength) {
          remaingSize = size; 
        } else {
          remaingSize = dbLength % (next_start_size - size) + 1;
        }

        this.endAll = true;
        
        if (remaingSize > 0) {
          return new Promise<any> ((resolve, reject) => {
            this.realtimeDB.list(dbPath, ref =>
            ref.orderByKey().limitToFirst(remaingSize)).valueChanges().subscribe (
              res=>resolve(res.reverse()),
              error=>reject(error)
            )
          })
        }

      }

      start_at = dbLength - next_start_size;
      end_at = start_at + size;
  
      return new Promise<any> ((resolve, reject) => {
        if (this.endAll == false) {
          this.realtimeDB.list(dbPath, ref =>
          ref.orderByKey().startAt(`${start_at}`).endAt(`${end_at}`)).valueChanges().subscribe (
            res=>resolve(res.reverse()),
            error=>reject(error)
          )
        } else {
          resolve([]);
          reject(false);
        }
  
      });
      
    }
  }
  
  // get all data once as an object
  getRealtimeDBdata(path:any) {
    let dbPath = this.realtimeDB.database.ref(path);
    return new Promise<any> ((resolve, reject) => {
      this.realtimeDB.object(dbPath).valueChanges().subscribe (
        res=>resolve(res),
        error=>reject(error)
      )
    })
  }

  saveToRealtimeDataDB(path: string, objData: object) {
    // save in firebase real time database
    // this.realtimeDB.object(path).set(objData).then( () => {
    //   return "true";
    // }).catch( ()=> {
    //   return false;
    // });

    return new Promise<any> ( (resolve, reject) => {
      this.realtimeDB.object(path).set(objData).then (
        (res: any)=>resolve(res),
        (err: any)=>reject(err)
      )
    })

  }

  updateRealtimeDBdata(path: string, objData: object) {
    return new Promise<any> ( (resolve, reject) => {
      this.realtimeDB.object(path).update(objData).then (
        res=>resolve(true),
        error=>reject(false)
      )
    })
  }

  sendPasswordResetEmail(email: any) {
    return new Promise<any> ( (resolve, reject) => {
      this.auth.sendPasswordResetEmail(email).then (
        (res: any)=>resolve({response: res, status: true}),
        (err: any)=>reject(err)
      )
    })

  }


  signupFireAuth (value) {
    return new Promise<any> ( (resolve, reject) => {
      this.auth.createUserWithEmailAndPassword (value.email, value.password).then (
        (res: any)=>resolve(res),
        (err: any)=>reject(err)
      )
    });
  }

  async IsLoggedIn(): Promise<boolean> {
    try {
      await new Promise((resolve, reject) =>
        this.auth.onAuthStateChanged(
          (user: any) => {
            if (user) {
              // User is signed in.
              resolve(user);
            } else {
              // No user is signed in.
              reject('no user logged in');
            }
          },
          // Prevent console error
          (error: any) => reject(error)
        )
      )
      return true
    } catch (error) {
      return error;
    }
  }

  loginFireAuth (value) {
    return new Promise<any> ( (resolve, reject) => {
      this.auth.signInWithEmailAndPassword (value.email, value.password).then (
        res=>resolve(res),
        error=>reject(error)
      )
    })

  }

  userDBinfo(userID) {
    let dbPath = this.realtimeDB.database.ref("users/" + userID);
    return new Promise<any> ((resolve, reject) => {
      this.realtimeDB.object(dbPath).valueChanges().subscribe (
        res=>resolve(res),
        error=>reject(error)
      )
    })
  }

  uploadFile2firebase(path, file) {
    let ref = this.firebaseStorage.ref(`${path}`);
    return new Promise<any> ((resolve, reject) => {
      ref.put(file).then(
        (res: any) => {
          ref.getDownloadURL().subscribe(imgURL=> {
            resolve(imgURL);
          });
        },
        (err: any) => {
          err=>reject(err)
        }
      );
    })
  }

}
