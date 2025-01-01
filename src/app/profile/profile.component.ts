import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { ProfileService } from './service/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user_name: String = '';
  user_email: String = '';
  user_resistration_date = '';
  user_profile_picture_url: string = '';


  // Variable to hold the uploaded file
  selectedFile: File | null = null;
  isError = false;
  imageErrorMessage: string = '';
  profileUpdated = false;
  profileUpdateMessage: string = '';


  constructor(private cookieService: CookieService, private profileService: ProfileService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user_email = this.cookieService.get('current-User');
    this.user_name = this.cookieService.get('user-name');
    this.user_resistration_date = this.cookieService.get('user-registrationDate');
    this.user_profile_picture_url = this.cookieService.get('user-profileURL');
    this.user_resistration_date = this.formatDate(this.user_resistration_date);


  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validFileTypes.includes(file.type)) {
        this.isError = true;
        this.imageErrorMessage = 'Please upload a valid image file (JPEG, JPG, PNG).'
        return;
      }

      // Validate file size (1 MB = 1,048,576 bytes)
      if (file.size > 1048576) {
        this.isError = true;
        this.imageErrorMessage = 'File size must not exceed 1 MB.'
        return;
      }
      this.isError = false;
      // Update the selected file and preview
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.user_profile_picture_url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  // Upload image to Image kit and then update url in database
  saveChanges() {
    console.log('File upload started');

    try {
      if (this.selectedFile) {
        console.log('File upload started');
    
        this.profileService.imageKitFileUpload(this.selectedFile).subscribe(
          (url) => {
            // If URL is returned from the service, assign it to the variable
            this.user_profile_picture_url = url;
            this.cookieService.set('user-profileURL',url);
            this.profileService.updateImageUrl(this.cookieService.get('current-User'), this.user_profile_picture_url).subscribe(
              (responseMessage) => {
                console.log('Message from webMethods: ' + responseMessage);
                this.profileUpdated = true;
                this.profileUpdateMessage = 'Profile picture updated successfully!';
              },
              (error) => {
                this.isError = true;
                this.imageErrorMessage = error.message || 'An error occurred while updating the profile picture.';
                console.error('Error updating profile URL:', error);
              }
            );
          },
          (error) => {
            this.isError = true;
            this.imageErrorMessage = error.message || 'An error occurred during file upload.';
            console.error('Error uploading file:', error);
          }
        );
      } else {
        this.isError = true;
        this.imageErrorMessage = 'No file selected for upload.';
      }
    
    } catch (error) {
      this.isError = true;
      this.imageErrorMessage = 'Something went wrong, try again later.';
      console.error('Unexpected error:', error);
    }
  }
}
