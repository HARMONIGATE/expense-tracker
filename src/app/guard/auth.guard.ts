import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';  // Use inject() to access services
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService); // Inject CookieService using the new API
  const router = inject(Router);  // Inject Router

  // Check if user is logged in (based on the 'current-User' cookie)
  const currentUser = cookieService.get('current-User');

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    router.navigate(['/login']);
    return false;
  }

  // If the user is logged in, allow access to the dashboard
  return true;
};
