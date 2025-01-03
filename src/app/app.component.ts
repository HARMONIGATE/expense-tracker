import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login-user/service/login.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Expense-Tracker';


  //set User logIn flag
  userLoggedIn = false;
  profileURL: string = '';
  // Variable to hold the active link
  activeLink: string = 'dashboard';
  isDropdownOpen = false;



  // Observable that tracks the login state
  userLoggedIn$: Observable<boolean>;

  constructor(private cookieService: CookieService, private loginService: LoginService,private route: Router) { 
    this.userLoggedIn$ = this.loginService.userLoggedIn$;
  }
  // Method to change active link
  setActiveLink(link: string) {
    this.activeLink = link;
  }

  ngOnInit(): void {
    //this.cookieService.deleteAll();
    this.userLoggedIn$.subscribe(loggedIn => {
      console.log('User login state changed:', loggedIn);
      // You can perform other actions here when the login state changes
      const currentUser = this.cookieService.get('current-User');
      if (currentUser) {
        this.userLoggedIn = true;
        console.log(this.userLoggedIn);
        this.profileURL = this.cookieService.get('user-profileURL');
        
      }
    });
    //incse event is not received
    const currentUser = this.cookieService.get('current-User');
    if (currentUser) {
      this.userLoggedIn = true;
      console.log(this.userLoggedIn);
      this.profileURL = this.cookieService.get('user-profileURL');
      
    }
  }

  signOut() {
    this.loginService.signOut();
    this.userLoggedIn=false;
    this.route.navigate(['/login']);
  }

  // Toggle the dropdown visibility
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
  }
}
