import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';  // CookieService to read cookies

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService); // Inject CookieService
  const router = inject(Router);  // Inject Router

  // Check if user is logged in (based on the 'current-User' cookie)
  const currentUser = cookieService.get('current-User'); 

  if (currentUser) {
    // If the user is logged in, redirect to the dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // If the user is not logged in, allow access to the login, register, and forget password pages
  return true;
};
