import {Injectable} from '@angular/core';
import {getAuth, signInWithEmailAndPassword, reauthenticateWithCredential,updateProfile,getAdditionalUserInfo} from 'firebase/auth';
import {getDownloadURL, getStorage, ref, uploadBytesResumable,deleteObject } from "firebase/storage";
import {UploadItem, UploadResponse} from "../../../model/uploadItem";
import {Rating} from "../../../model/rating";
import {SightTopLocation} from "../../../model/sight";
import firebase from "firebase/compat";
import User = firebase.User;
import AuthCredential = firebase.auth.AuthCredential;
import {Console} from "inspector";


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


    /**
     * Uploads a file to the firestore storage API
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    // @ts-ignore
    public async uploadFileToFirestore(uploadFile:UploadItem) : Promise<UploadResponse>{
        var response = new UploadResponse();

        // Create a root reference
        const storage = getStorage();

        // Create a reference
        //const newFileRef = ref(storage, 'images/rating/mountains.jpg');
        const newFileRef = ref(storage, uploadFile.filePath);
        const uploadTask = uploadBytesResumable(newFileRef, uploadFile.file);

        await uploadTask.then(async res => {
            var t = res;
            if (res.state === "success") {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    response.response = downloadURL;
                    response.hasErrors = false;
                    response.finished = true;
                });
            }
            else {
                console.log('Error');
                response.response = undefined;
                response.hasErrors = true;
                response.finished = true;
            }
        });

        return response;
    }

    /**
     * Loads all image urls of a rating.
     * @param uid
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    public async getRatingImageUrls(rating:Rating){
        const storage = getStorage();
        rating.imageUrl = [];
        rating.imageNames.forEach(async rat=>{
            try {
                rating.imageUrl.push(await getDownloadURL(ref(storage, 'images/rating/'+rating.uid+'/'+rat+'/')))
            }
            catch (e) {
                console.log(e);
            }

        })

    }

    /**
     * Loads all image urls of a sight.
     * @param uid
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    public async getSightImageUrls(sight:SightTopLocation){
        const storage = getStorage();
        sight.allImageUrl = [];

        sight.ratingList.forEach(rat=>{
            rat.imageNames.forEach(async img=>{
                try {
                    sight.allImageUrl.push(await getDownloadURL(ref(storage, 'images/rating/'+rat.uid+'/'+img+'/')))
                }
                catch (e) {
                    console.log(e);
                }

            })
        })
    }
    public getProfilePictureUrl(user:any){
        const storage = getStorage();
        let profilePictureURL = getDownloadURL(ref(storage,'images/avatars/'+user.uid+'/img_0'));
        return profilePictureURL;
    }

}
