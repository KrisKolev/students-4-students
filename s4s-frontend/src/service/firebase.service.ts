import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn = false
  constructor() { }

  public async firebaseSignin(email: string, password : string) : Promise<boolean> {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log(user);

              localStorage.setItem('loggedInUser',JSON.stringify(user));

              return true;
              // ...
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(error)
              return false;
          });

      return false;
  }

  logout(){
    localStorage.removeItem('loggedInUser')
    getAuth().signOut();
  }
}
