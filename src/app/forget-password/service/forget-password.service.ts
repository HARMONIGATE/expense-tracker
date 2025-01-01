import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {


  private otpApiUrl = environment.baseurl + environment.forgetPassOTP; // Replace with your send OTP API URL
  private forgetPassApiUrl = environment.baseurl + environment.forgetPass; // Replace with your send OTP API URL
  private username = environment.userid // Replace with your username
  private password = environment.password; // Replace with your password

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }

  sendOtp(email: string): Observable<string> { 
    const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
        const body = { email };
    
        return this.http.post<any>(this.otpApiUrl, body, { headers }).pipe(
          map((response) => {
            if (response.otp) {
              return response.otp; // Extract OTP from successful response
            }
            throw new Error('Invalid response format');
          }),
          catchError((error) => {
            const errorMsg =
              error.status === 500
                ? error.error?.error || 'Something went wrong'
                : 'Failed to send OTP';
            return throwError(() => new Error(errorMsg));
          })
        );
  }



  resetPass(email:string,pass:string):Observable<string> {
    const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    const body = { email, pass};
    return this.http.patch<any>(this.forgetPassApiUrl, body, { headers }).pipe(
      map((response) => {
        if (response.message) {
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


}
