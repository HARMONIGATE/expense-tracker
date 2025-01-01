import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private imageKitUrl = environment.imageKitApiUrl;
  private updateProfileUrl = environment.baseurl+environment.profileUpdate;
  private imageKitUserName = environment.imageKitUserId;
  private imageKitPass = environment.imageKitUserPass;
  private apiUser = environment.userid;
  private apiPass = environment.password;
  private imageKitFolder = environment.imageKitFolder;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private emailId = this.cookieService.get('current-User');

  // Create the Basic Auth header
  private apiGetHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.apiUser}:${this.apiPass}`)}`,
    });
  }

  // File upload to ImageKit
  imageKitFileUpload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', this.emailId + '.jpg');
    formData.append('folder', this.imageKitFolder);

    // Create the Basic Auth header
    const authHeader = 'Basic ' + btoa(`${this.imageKitUserName}:${this.imageKitPass}`);
    const headers = new HttpHeaders({
      'Authorization': authHeader,
    });

    // Send the file to ImageKit via POST
    return this.http
      .post<any>(this.imageKitUrl, formData, { headers })
      .pipe(
        map((response) => {
          if (response && response.url) {
            // Return the URL from ImageKit response
            return response.url;
          } else {
            throw new Error('ImageKit response does not contain a valid URL');
          }
        }),
        catchError((error) => {
          console.error('Upload failed:', error);
          return throwError(() => new Error('Error occurred during file upload'));
        })
      );
  }

  updateImageUrl(emailID: string, profileUrl: string): Observable<string> {
    const headers = this.apiGetHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    const body = { emailID, profileUrl };
  
    return this.http.patch<any>(this.updateProfileUrl, body, { headers }).pipe(
      map((response) => {
        if (response.message) {
          // Successfully updated image URL
          this.cookieService.set('user-profileURL', profileUrl);
          return response.message; // Return success message
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => {
        let errorMsg: string;
  
        // Check error status and message
        if (error.status === 500) {
          errorMsg = error.error?.error || 'Something went wrong. Please try again later.';
        } else {
          errorMsg = error.error?.message || 'Something went wrong. Please try again later.';
        }
  
        // Ensure error message is returned to the subscriber
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
