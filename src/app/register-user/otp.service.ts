import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private apiUrl = environment.baseurl+environment.signupOtpUrl; // Replace with your send OTP API URL
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

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
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
}
