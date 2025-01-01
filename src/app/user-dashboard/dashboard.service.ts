import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.baseurl + environment.dashBoardInfo; // Replace with your send OTP API URL
  private username = environment.userid // Replace with your username
  private password = environment.password; // Replace with your password

  constructor(private cookieService: CookieService,private http: HttpClient) { }
  getDashboardInfo(): Observable<any> {
  
      // Basic Authentication header (base64 encoded username:password)
      const credentials = btoa(`${this.username}:${this.password}`); // Base64 encode the credentials
      const headers = new HttpHeaders({
        'Authorization': `Basic ${credentials}`  // Add the Basic auth header
      });
      // Encode the email parameter properly
      const email = encodeURIComponent(this.cookieService.get('current-User'));
  
      // Correctly append the email parameter to the URL with a "?" for the first query parameter
      const url = `${this.apiUrl}?userEmail=${email}`;
      return this.http.get<any>(url, { headers }).pipe(
        catchError((error) => {
          // Handle the error and return a user-friendly message
          return throwError(() => new Error('Something went wrong, please try again later.'));
        })
      );
    }
}
