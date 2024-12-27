import { Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginUserComponent } from './login-user/login-user.component';
import{UserDashboardComponent} from './user-dashboard/user-dashboard.component'
export const routes: Routes = [
    { path: 'login', component: LoginUserComponent },
  { path: 'signup', component: RegisterUserComponent },
  {path:'forgetPassword',component:ForgetPasswordComponent},
  {path:'dashboard',component:UserDashboardComponent},
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
];
