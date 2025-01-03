import { Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { authGuard } from './guard/auth.guard';
import { redirectIfLoggedInGuard } from './guard/redirect-if-logged-in.guard'
import { ExpenseComponent } from './expense/expense.component';
import { CategoryComponent } from './category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { IncomeExpenceDetailsComponent } from './income-expence-details/income-expence-details.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginUserComponent,
    canActivate: [redirectIfLoggedInGuard]  // If logged in, redirect to dashboard
  },
  {
    path: 'signup',
    component: RegisterUserComponent,
    canActivate: [redirectIfLoggedInGuard]  // If logged in, redirect to dashboard
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    canActivate: [redirectIfLoggedInGuard]  // If logged in, redirect to dashboard
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard]  // Apply the authGuard to protect the dashboard route
  },
  {
    path: 'expense',
    component: ExpenseComponent,
    canActivate: [authGuard]  // Apply the authGuard to protect the dashboard route
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [authGuard]  // Apply the authGuard to protect the dashboard route
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]  // Apply the authGuard to protect the dashboard route
  },
  {
    path: 'inconeOrExpense',
    component: IncomeExpenceDetailsComponent,
    canActivate: [authGuard]  // Apply the authGuard to protect the dashboard route
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default to login if no route is matched
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];
