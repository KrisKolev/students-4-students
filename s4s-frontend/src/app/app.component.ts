import {Component} from '@angular/core';
import {BackendCheckService} from '../service/backend_check.service';
import {GeolocationService} from '../service/geolocation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';

    constructor(private backendCheckService: BackendCheckService,
                private geolocationService: GeolocationService) {
        backendCheckService.getEcho().subscribe(res => {
            console.log(res);
        });

        if (!navigator.geolocation) {
            console.log('geolocation is not supported');
        } else {
            navigator.geolocation.getCurrentPosition((position => {
                geolocationService.getGeoInformation(String(position.coords.latitude), String(position.coords.longitude))
                    .subscribe(res => {
                        console.log(res.city);
                        //console.log(res);
                });
            }));
        }
    }
}
