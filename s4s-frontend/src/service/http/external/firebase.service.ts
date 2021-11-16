import {Injectable} from '@angular/core';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {UploadItem, UploadResponse} from "../../../model/uploadItem";
import {Rating} from "../../../model/rating";
import {SightTopLocation} from "../../../model/sight";

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
    public async uploadFileToFirestore(uploadFile:UploadItem) : Promise<UploadResponse>{
        var response = new UploadResponse();

        // Create a root reference
        const storage = getStorage();

        // Create a reference
        //const newFileRef = ref(storage, 'images/rating/mountains.jpg');
        const newFileRef = ref(storage, uploadFile.filePath);

        getDownloadURL(ref(storage, uploadFile.filePath))
            .then((url) => {

            })
            .catch((error) => {
                // Handle any errors
            });

        const uploadTask = uploadBytesResumable(newFileRef, uploadFile.file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log(error.code)
                        response.finished = true;
                        response.hasErrors = true;
                        break;
                    case 'storage/canceled':
                        console.log(error.code)
                        response.finished = true;
                        response.hasErrors = true;
                        break;
                    case 'storage/unknown':
                        console.log(error.code)
                        response.finished = true;
                        response.hasErrors = true;
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    response.response = downloadURL;
                    response.finished = true;
                    return response
                });
            }
        );

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
                sight.allImageUrl.push(await getDownloadURL(ref(storage, 'images/rating/'+rat.uid+'/'+img+'/')))
            })
        })
    }
}
