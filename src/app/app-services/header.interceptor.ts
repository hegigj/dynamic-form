import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = 'b6fb2700-9a10-401e-b864-b08c5d67928d';
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
