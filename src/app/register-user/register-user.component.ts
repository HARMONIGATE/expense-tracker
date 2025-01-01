import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl, ValidationErrors} from '@angular/forms';
import { OtpService } from './otp.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf ,NgFor,NgClass} from '@angular/common';
import { RegisterService } from './register.service';
import{Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule,NgIf,NgFor,NgClass],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {

  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  otpSent = false;
  otpError: string=''; 
  passwordsDoNotMatch = false;
  otpVerified = false;
  generatedOtp: string = ''; // Store the generated OTP
  registerError=false;
  registerErrorMessage:string='';
  registrationMessage:string='';
  submitButtonClicked=false;


  constructor(private fb: FormBuilder, private otpService: OtpService, private registerService :RegisterService,private router:Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [
        Validators.required, 
        Validators.minLength(5), 
        this.noNumbersOrSpecialCharacters
      ]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
      otp: [''],
    });

    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') this.showPassword = !this.showPassword;
    if (field === 'confirmPassword') this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordsMatch() {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    this.passwordsDoNotMatch = password && confirmPassword && password !== confirmPassword;
  }

  sendOtp() {
    const email = this.signupForm.get('email')?.value;
    this.otpService.sendOtp(email).subscribe({
      next: (otp) => {
        this.generatedOtp = otp; // Save the OTP locally
        this.otpSent = true;
        this.otpError = '';  // Reset the error if OTP is sent successfully
      },
      error: (err) => {
        this.otpError = err.message || 'Failed to send OTP'; // Set the error message
        this.otpSent = false; // Reset OTP sent status
      },
    });
  }

  verifyOtp() {
    const enteredOtp = this.signupForm.get('otp')?.value;
    if (this.generatedOtp === enteredOtp) {
      this.otpVerified = true;
      this.otpError = '';
    } else {
      this.otpVerified = false;
      this.otpError = 'Invalid OTP. Please try again.';
    }
  }


  registerUser() {
    const email = this.signupForm.get('email')?.value;
    const pass=this.signupForm.get('password')?.value;
    const name=this.signupForm.get('name')?.value;
    this.registerService.registerUser(email,pass,name).subscribe({
      next: (successMessage) => {
        this.registrationMessage = successMessage; // save error message locally
        // Navigate to another route after 2 seconds
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 2000);  // 2000 ms = 2 seconds
      },
      error: (err) => {
        this.registerErrorMessage = err.message || 'Failed to send OTP'; // Set the error message
        this.registerError = true; // Reset OTP sent status
      },
    });
  }

// Custom validator for name field (no numbers or special characters)
noNumbersOrSpecialCharacters(control: AbstractControl): ValidationErrors | null {
  const regex = /^[A-Za-z ]*$/; // Regex to allow only letters and spaces
  if (control.value && !regex.test(control.value)) {
    return { invalidName: true }; // Return custom error if invalid
  }
  return null; // Return null if the value is valid
}

//submit form
  onSubmit() {
    if (!this.otpSent) {
      this.sendOtp();
    } else if (!this.otpVerified) {
      this.verifyOtp();
    } else if (this.signupForm.valid && this.otpVerified) {
      this.submitButtonClicked=true;
      //Register user
      this.registerUser();
    }
  }
  
}
