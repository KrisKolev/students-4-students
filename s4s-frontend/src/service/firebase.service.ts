import {Injectable} from '@angular/core';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    isLoggedIn = false;

    constructor(private userService: UserService) {
    }

    public async firebaseSignin(email: string, password: string): Promise<boolean> {
        var signResult = false;
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);

                localStorage.setItem('loggedInUser', JSON.stringify(user));
                signResult = true;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                signResult = false;
            });
        return signResult;
    }

    // Function which handles a successfull login
    login(){
        const auth = getAuth();

        this.userService.setUserId(auth.currentUser.uid);
        this.userService.setEmail(auth.currentUser.email);
        this.userService.setAccessToken(auth.currentUser.accessToken);
    }

    logout() {
        localStorage.removeItem('loggedInUser');
        getAuth().signOut();
    }
}
