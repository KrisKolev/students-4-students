import {Injectable} from '@angular/core';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

@Injectable({providedIn: 'root'})
export class FirebaseService {

    public async firebaseSignin(email: string, password: string, localStorageName: string): Promise<boolean> {
        var signResult = false;
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem(localStorageName, JSON.stringify(user));
                signResult = true;
            })
            .catch((error) => {
                console.log(error);
                signResult = false;
            });
        return signResult;
    }

    public async firebaseSignOut(localStorageName: string) {
        localStorage.removeItem(localStorageName);
        getAuth().signOut();
    }
}
