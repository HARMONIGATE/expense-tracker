import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ForgetPasswordService } from './service/forget-password.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf, NgFor, NgClass],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  forgetPassForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  otpSent = false;
  otpError: string = '';
  passwordsDoNotMatch = false;
  otpVerified = false;
  generatedOtp: string = ''; // Store the generated OTP
  forgetPassError = false;
  forgetPassErrorMessage: string = '';
  forgetPassMessage: string = '';
  submitButtonClicked = false;

  constructor(private fb: FormBuilder, private router: Router, private forgetPassService: ForgetPasswordService) {
    this.forgetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    this.forgetPassForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') this.showPassword = !this.showPassword;
    if (field === 'confirmPassword') this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordsMatch() {
    const password = this.forgetPassForm.get('password')?.value;
    const confirmPassword = this.forgetPassForm.get('confirmPassword')?.value;
    this.passwordsDoNotMatch = password && confirmPassword && password !== confirmPassword;
  }
  //Send one Time Password
  sendOtp() {
    const email = this.forgetPassForm.get('email')?.value;
    this.forgetPassService.sendOtp(email).subscribe({
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

  //verify One Time Password
  verifyOtp() {
    const enteredOtp = this.forgetPassForm.get('otp')?.value;
    if (this.generatedOtp === enteredOtp) {
      this.otpVerified = true;
      this.otpError = '';
    } else {
      this.otpVerified = false;
      this.otpError = 'Invalid OTP. Please try again.';

    }
  }

  //reset password
  resetPassword() {
    const email = this.forgetPassForm.get('email')?.value;
    const pass=this.forgetPassForm.get('password')?.value;
    this.forgetPassService.resetPass(email,pass).subscribe({
      next: (successMessage) => {
        this.forgetPassMessage = successMessage; // save error message locally
        // Navigate to another route after 2 seconds
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 3000);  // 2000 ms = 2 seconds
      },
      error: (err) => {
        this.forgetPassErrorMessage = err.message || 'Failed to send OTP'; // Set the error message
        this.forgetPassError = true;
      },
    });
  }

  onSubmit() {
    this.submitButtonClicked=true;
    this.resetPassword();
   }



}
