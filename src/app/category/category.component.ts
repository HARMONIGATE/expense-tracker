import { Component } from '@angular/core';
import { CategoryService } from './category.service'
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: any[] = [];
  errorMessage: string | null = null; // To store error message
  currentUserEmail!: string;
  selectedCategory_Type!: string;
  options: any[] = ['Expense', 'Earning', 'Saving']
  successReturnMessage:string='';

  //Open modal
  isModalOpen = false;
  newCategory = { name: '', type: '', image: '' };

  icons: { id: string, path: string }[] = [];
  //category Error
  categoryError=false;
  categoryErrorMessage:string='';
  categoryMessage:string='';


  constructor(private categoryService: CategoryService) { }



  ngOnInit(): void {
    this.fetchCategories();
  }
  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.Categories;
        this.errorMessage = null; // Reset error message on success
        //load icons
        this.icons = this.categories.map(category => ({
          id: category.ID,          // Extracting the ID
          path: category.IMAGE_URL  // Extracting the IMAGE_URL (path to the icon)
        }));
      },
      error: (err) => {
        this.errorMessage = err.message; // Set error message
        this.categories = []; // Clear categories in case of error
      },
    });
  }


  // Function to open the modal
  openModal() {
    this.isModalOpen = true;
  }
  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }


  // Function to handle icon selection
  selectIcon(icon: any) {
    this.newCategory.image = icon.path; // Store the selected icon's path in the category object
  }
  // Handle form submission
  onSubmit() {
    if (this.newCategory.name && this.newCategory.type && this.newCategory.image) {
      this.categoryService.createCategory(this.newCategory.name, this.newCategory.type, this.newCategory.image).subscribe({
        next: (successMessage) => {
          this.categoryMessage = successMessage;
          this.categoryError=false;
          setTimeout(() => {
            this.categoryMessage='';
            this.closeModal();
            window.location.reload();
          }, 2000);  // 2000 ms = 2 seconds
        },
        error: (err) => {
          this.categoryError = true;
          this.categoryErrorMessage = err.message || 'Something went wrong, please try after sometime!'; // Set the error message
          setTimeout(() => {
            this.categoryErrorMessage='';
            this.closeModal();
          }, 2000);  // 2000 ms = 2 seconds
        },

      });
    }


  }

//delete category start
confirmDeletion(id:string): void {
  if(confirm("Are you sure to delete ")) {
    this.deleteCategory(id);
  }
}

deleteCategory(categoryId: string): void {
  // Logic to delete the category using the categoryId

  this.categoryService.deleteCategory(categoryId).subscribe({
    next: (successMessage) => {
      this.successReturnMessage = successMessage;
      setTimeout(() => {
        this.successReturnMessage = '';
        this.fetchCategories();
      }, 2000);  // 2000 ms = 2 seconds
    },
    error: (err) => {
      this.errorMessage = err.message || 'Something went wrong, please try after sometime!'; // Set the error message
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);  // 2000 ms = 2 seconds
    },

  });
}


//delete category end

}
