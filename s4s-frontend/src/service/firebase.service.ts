import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn = false
  constructor() { }

  public async signin(email: string, password : string){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log(user)
              // ...
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(error)
          });
  }

  logout(){
    getAuth().signOut();
  }
}
