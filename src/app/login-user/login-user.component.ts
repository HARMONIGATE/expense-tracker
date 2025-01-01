import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl, ValidationErrors} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgIf ,NgFor,NgClass} from '@angular/common';
import { LoginService } from './service/login.service';
import{Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass,RouterLink,RouterLinkActive,HttpClientModule,ReactiveFormsModule,NgIf,NgFor,NgClass],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {
  
  showPassword = false;
  loginForm: FormGroup;
  logInMessage:string='';
  logInErrorMessage:string='';
  loginError=false;
  //browser related info 
  browserName: string = '';
  browserVersion: string = '';
  os: string = '';
  userAgent: string = '';
  deviceType: string = '';
  clientInfo:string=''

  ngOnInit(): void {
    this.getBrowserInfo();
    this.getDeviceInfo();

    this.clientInfo='BrowserName : '+this.browserName+' '+'Browser Version : '+this.browserVersion+' Useragent: '+this.userAgent+' DeviceType: '+this.deviceType;
  }


  // Get Browser Info
  getBrowserInfo(): void {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Chrome") > -1) {
      this.browserName = 'Chrome';
    } else if (userAgent.indexOf("Safari") > -1) {
      this.browserName = 'Safari';
    } else if (userAgent.indexOf("Firefox") > -1) {
      this.browserName = 'Firefox';
    } else if (userAgent.indexOf("Edge") > -1) {
      this.browserName = 'Edge';
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
      this.browserName = 'Internet Explorer';
    }

    this.browserVersion = this.getBrowserVersion(userAgent);
    this.userAgent = userAgent;
  }

  // Extract the browser version from user agent
  getBrowserVersion(userAgent: string): string {
    const version = userAgent.match(/(?:Chrome|Safari|Firefox|MSIE|Edge)[\/\s](\d+(\.\d+)?)/);
    return version ? version[1] : 'Unknown Version';
  }

  // Get Device Info (OS)
  getDeviceInfo(): void {
    const userAgent = navigator.userAgent;
    console.log('agent data '+userAgent)
    if (userAgent.indexOf("Windows NT") > -1) {
      this.os = 'Windows';
      this.deviceType = 'Desktop';
    } else if (userAgent.indexOf("Mac") > -1) {
      this.os = 'Mac OS';
      this.deviceType = 'Desktop';
    } else if (userAgent.indexOf("Linux") > -1) {
      this.os = 'Linux';
      this.deviceType = 'Desktop';
    } else if (userAgent.indexOf("iPhone") > -1) {
      this.os = 'iOS';
      this.deviceType = 'Mobile';
    } else if (userAgent.indexOf("iPad") > -1) {
      this.os = 'iOS';
      this.deviceType = 'Tablet';
    } else if (userAgent.indexOf("Android") > -1) {
      this.os = 'Android';
      this.deviceType = 'Mobile';
    } else {
      this.os = 'Unknown';
      this.deviceType = 'Unknown';
    }
  }




  constructor(private fb: FormBuilder,private loginService:LoginService,private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/),
        ],
      ]
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    }
  }


loginUser(){
  const email = this.loginForm.get('email')?.value;
  const pass = this.loginForm.get('password')?.value;
  this.loginService.LogInUser(email,pass,this.clientInfo).subscribe({
    next: (successMessage) => {
      this.logInMessage = successMessage; 
      console.log(this.logInMessage);
      // save error message locally
      // Navigate to another route after 2 seconds
                setTimeout(() => {
                  window.location.reload();
                }, 2000);  // 2000 ms = 2 seconds
    },
    error: (err) => {
      this.logInErrorMessage = err.message || 'failed to login'; // Set the error message
      console.log(this.logInErrorMessage);
      this.loginError = true; // Reset OTP sent status
    },
  });
}





  // Submit logic
  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const pass = this.loginForm.get('password')?.value;
    console.log('Email:', email, 'Password:', pass);
    this.loginUser();
  }

}
