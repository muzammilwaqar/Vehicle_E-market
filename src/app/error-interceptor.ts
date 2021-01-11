import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor
{

  constructor(private dialog: MatDialog){}



  intercept(req: HttpRequest<any>,next: HttpHandler)
  {
     return next.handle(req).pipe(
       catchError((error:HttpErrorResponse) =>
       {
         let errorMessgae = "An Unknown Error Occurred!";
         if(error.error.message)
         {
          errorMessgae = error.error.message;
         }
         this.dialog.open(ErrorComponent, {data: {message:errorMessgae }});
         //console.log(error);
         //alert(error.error.message);
         //alert(error.error.error.message);
         return throwError(error);
       })
     );
  }
}
