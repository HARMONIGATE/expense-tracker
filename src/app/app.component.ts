import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login-user/service/login.service';

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
  profileURL:string='';
  // Variable to hold the active link
  activeLink: string = 'dashboard';

  constructor(private cookieService: CookieService,private loginService:LoginService) { }
  // Method to change active link
  setActiveLink(link: string) {
    this.activeLink = link;
  }

  ngOnInit(): void {
    const currentUser = this.cookieService.get('current-User');
    if (currentUser) {
      this.userLoggedIn = true;
      this.profileURL= this.cookieService.get('user-profileURL');
    }

  }

  signOut(){
    this.loginService.signOut();
  }

}
