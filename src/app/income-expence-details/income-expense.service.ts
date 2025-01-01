import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class IncomeExpenseService {
   private apiUrl = environment.baseurl + environment.addTransaction; // Replace with your send OTP API URL
   private getTransactionUrl=environment.baseurl+environment.getTransaction;
   private deleteTransactionUrl=environment.baseurl+environment.deleteTransaction;
   private username = environment.userid // Replace with your username
   private password = environment.password; // Replace with your password

  constructor(private http: HttpClient,private cookieService: CookieService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }
  insertTransactionRecord(categoryName :string,categoryType:string,imageUrl:string,shortNote:string,transactionDate:string,amount:string): Observable<string>{

    const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    const userEmail=this.cookieService.get('current-User');
    const body = { categoryName, categoryType,userEmail,imageUrl,shortNote,transactionDate,amount};

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
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
          
        } else {
          // Handle other errors
          errorMsg = 'Something went wrong, Please try after sometime';
          
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getTransactions(filter:string,startdate:string,endDate:string):Observable<any>{
    const credentials = btoa(`${this.username}:${this.password}`); // Base64 encode the credentials
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`  // Add the Basic auth header
    });
    // Encode the email parameter properly
    const email = encodeURIComponent(this.cookieService.get('current-User'));

    // Correctly append the email parameter to the URL with a "?" for the first query parameter
    const url = `${this.getTransactionUrl}?userEmail=${email}&filter=${filter}&startdate=${startdate}&endDate=${endDate}`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle the error and return a user-friendly message
        return throwError(() => new Error('Something went wrong, please try again later.'));
      })
    );

  }
  
deleteRecord(id:string): Observable<string>{
  const headers = this.getHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
  const body = { id};

  return this.http.delete<any>(this.deleteTransactionUrl, {
    body, // Include the body in the options
    headers,
  }).pipe(
    map((response) => {
      if (response?.message) {
        return response.message; // Extract response message
      }
      throw new Error('Invalid response format');
    }),
    catchError((error) => {
      let errorMsg: string;
  
      if (error.status === 500) {
        // Handle Internal Server Error
        errorMsg = error.error?.error || 'Something went wrong, Please try again later';
      } else {
        // Handle other errors
        errorMsg = 'Something went wrong, Please try again later';
      }
  
      return throwError(() => new Error(errorMsg));
    })
  );
}

}
