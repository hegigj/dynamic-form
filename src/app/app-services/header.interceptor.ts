import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = 'bd8927f1-280c-4c03-b436-3eaf6cd7b34e';
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
