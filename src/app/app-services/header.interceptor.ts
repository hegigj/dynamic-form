import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = '295fafe3-617b-4e5a-88ff-117b7ac6d2a0';
    const lang = 'en';
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
