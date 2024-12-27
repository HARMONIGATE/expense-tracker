import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  private apiUrl = environment.baseurl+environment.registerUserUrl; // Replace with your send OTP API URL
  private username = environment.userid // Replace with your username
  private password = environment.password; // Replace with your password

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }



  registerUser(email:string,pass:string,name:string): Observable<string> {
      const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
      const body = { email,pass,name };
  console.log(body);
      return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
        map((response) => {
          if (response.successMessage) {
            return response.successMessage; // Extract OTP from successful response
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
            errorMsg = error.error?.message || email+' User Already exists with Us, Please login!';
          } else {
            // Handle other errors
            errorMsg = 'Unable to register you, please try after some time';
          }
        
          return throwError(() => new Error(errorMsg));
        })
      );
    }
}
