import {Injectable} from "@angular/core";
import {BackendClientService} from "../backendClientService";
import {getAuth} from 'firebase/auth';
@Injectable({providedIn: 'root'})
export class ProfileService extends BackendClientService {

    updateUserProfile(firstname: string, lastname: string, nickname: string, uid:string) {

        return this.createPostCall('user/update', {
            'firstname': firstname,
            'lastname': lastname,
            'nickname': nickname,
            'uid': uid
        });
    }
    updateUserPassword(password: string, uid:string) {
        return this.createPostCall('user/updatepassword', {
            'password': password,
            'uid': uid
        });
    }
    updateUserAvatar(photoUrl: string, uid:string) {
        console.log(photoUrl)
        return this.createPostCall('user/updateavatar', {
            'photoUrl': photoUrl,
            'uid': uid
        });
    }

    deleteUser() {
        return this.createDeleteCall('user/delete',)
    }
}
