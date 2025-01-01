import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {


   private apiUrl = environment.baseurl + environment.loginUserURL; // Replace with your send OTP API URL
    private username = environment.userid // Replace with your username
    private password = environment.password; // Replace with your password

  constructor(private http: HttpClient,private cookieService: CookieService) { }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }


  LogInUser(email :string,pass:string,clientInfo:string): Observable<string>{

    const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    const body = { email, pass,clientInfo};

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        if (response.message) {
          this.cookieService.set('current-User', body.email);
          this.cookieService.set('user-registrationDate', response.registrationDate);
          this.cookieService.set('user-profileURL', response.profileURL);
          this.cookieService.set('user-name', response.name);
          return response.message; // Extract response
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => {
        let errorMsg: string;

        if (error.status === 500) {
          // Handle Internal Server Error
          errorMsg = error.error?.error || 'Something went wrong, Please try after sometime';
          
        } else if (error.status === 422) {
          // Handle Unprocessable Entity (Validation Errors)
          errorMsg = error.error?.message || email + ' User Already exists with Us, Please login!';
          
        } else {
          // Handle other errors
          errorMsg = 'Unable to register you, please try after some time';
          
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }


  signOut(){
    this.cookieService.deleteAll();
  }
}
