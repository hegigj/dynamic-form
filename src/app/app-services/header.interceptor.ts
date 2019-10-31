import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = '5e4a1507-2df0-434e-b3da-972a852d72da';
    const lang = localStorage.getItem('language');
    const headers = {
      'Authorization': userToken,
      'Accept-Language': lang,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (userToken) {
      const cloned = req.clone({
        setHeaders: headers
      });
      return next.handle(cloned);

    } else {
      return next.handle(req);
    }
  }
}
