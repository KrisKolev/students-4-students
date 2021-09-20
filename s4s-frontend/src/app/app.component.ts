import {Component} from '@angular/core';
import {BackendCheckService} from '../service/backend_check.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';

    constructor(private backendCheckService: BackendCheckService) {
        backendCheckService.getEcho().subscribe(res => {
            console.log(res);
        });
    }
}
