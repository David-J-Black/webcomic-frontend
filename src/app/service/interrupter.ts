import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()
export class DefaultApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
      console.log('Intercepting... cock')
    let req_clone = req.clone({
      setHeaders: {
        'doYouThinkImPretty': 'yes'
      }
    });
    return next.handle(req_clone);
  }
}
