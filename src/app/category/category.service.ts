import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private apiUrl = environment.baseurl + environment.getCategory; // Replace with your send OTP API URL
  private createCategoryURL=environment.baseurl +environment.createCategory;
  private deletCategoryURL=environment.baseurl +environment.deleteCategory;
  private username = environment.userid // Replace with your username
  private password = environment.password; // Replace with your password


  constructor(private http: HttpClient, private cookieService: CookieService) { }
   // Create the Basic Auth header
   private apiGetHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }  
  getCategories(): Observable<any> {

    // Basic Authentication header (base64 encoded username:password)
    const credentials = btoa(`${this.username}:${this.password}`); // Base64 encode the credentials
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`  // Add the Basic auth header
    });
    // Encode the email parameter properly
    const email = encodeURIComponent(this.cookieService.get('current-User'));

    // Correctly append the email parameter to the URL with a "?" for the first query parameter
    const url = `${this.apiUrl}?email=${email}`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle the error and return a user-friendly message
        return throwError(() => new Error('Something went wrong, please try again later.'));
      })
    );
  }

  createCategory(email: string, categoryName: string, categoryType: string, imageUrl: string): Observable<string> {
    const headers = this.apiGetHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    const body = { email, categoryName, categoryType, imageUrl };
  
    return this.http.post<any>(this.createCategoryURL, body, { headers }).pipe(
      map((response) => {
        if (response.message) {
          // Successfully created category
          return response.message; // Return success message
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => {
        let errorMsg: string;
  
        // Handle error status and messages
        if (error.status === 500) {
          errorMsg = error.error?.error || 'Something went wrong on the server. Please try again later.';
        } else {
          errorMsg = error.error?.message || 'Something went wrong. Please check your input and try again.';
        }
  
        // Return error message to the subscriber
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  deleteCategory(id:string): Observable<string> {
    // Basic Authentication header (base64 encoded username:password)
    const credentials = btoa(`${this.username}:${this.password}`); // Base64 encode the credentials
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`  // Add the Basic auth header
    });
    
    // Correctly append the email parameter to the URL with a "?" for the first query parameter
    const url = `${this.deletCategoryURL}?id=${id}`;
    return this.http.delete<any>(url, { headers }).pipe(
      map((response) => {
        if (response.message) {
          // Successfully created category
          return response.message; // Return success message
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => {
        // Handle the error and return a user-friendly message
        return throwError(() => new Error('Something went wrong, please try again later.'));
      })
    );
  }
}
