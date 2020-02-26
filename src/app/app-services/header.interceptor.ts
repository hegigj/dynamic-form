import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

<<<<<<< HEAD
    const userToken = '07ac568a-2a6d-4dd5-b7ea-e5c833e9e83a';
=======
    const userToken = 'fab6edcb-3943-434b-87b2-9692bc6bef40';
>>>>>>> 1a1f20184f374074b3734fce86c54c2df3fc6ab8
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
