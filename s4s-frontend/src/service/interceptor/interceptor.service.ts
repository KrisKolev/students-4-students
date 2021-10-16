import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserAuthService} from "../userAuthService";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    constructor(private userAuthService: UserAuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let accessToken = this.userAuthService.getAccessToken();

        if (accessToken !== null) {
            request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                console.log(event)
                return event;
            }));
    }
}