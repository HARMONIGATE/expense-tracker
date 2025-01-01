import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category/category.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IncomeExpenseService } from './income-expense.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-income-expence-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './income-expence-details.component.html',
  styleUrl: './income-expence-details.component.css'
})
export class IncomeExpenceDetailsComponent {

  //Open modal
  isModalOpen = false;
  transactionForm!: FormGroup;
  categories: any[] = [];
  options: any[] = ['Expense', 'Earning', 'Saving'];
  selectedCategory_Name!: string;
  successMessage: string = '';
  errorMessage: string = '';
  emailUrlPath: string = '';
  loadErrorMessage: string = '';

  //filter
  selectedFilter: string = 'today'; // Default filter option
  startDate: string = '';
  endDate: string = '';
  transactions: any[] = [];
  savingTotal: string = '';
  earningsTotal: string = '';
  expenseTotal: string = '';
  amountLeft:string=';'


  //delete temp variables
  deleteMessage: string = '';
  deleteErrorMessage: string = '';

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private incomeExpenseService: IncomeExpenseService) { }


  ngOnInit(): void {
    // Call getTransactions() to fetch data on page load
    this.getTransactions('Today', '', '');

    // Initialize the form
    this.transactionForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryType: ['', Validators.required],
      transactionDate: ['', Validators.required],
      shortNote: ['', [Validators.maxLength(50)]],  // Allow short note up to 50 characters
      amount: ['', [Validators.required, Validators.min(1)]],  // Ensure amount is required and > 0
      imageURL: [''],
    });

    // Subscribe to value changes of 'categoryName'
    this.transactionForm.get('categoryName')?.valueChanges.subscribe(value => {
      this.selectedCategory_Name = value;
    });
  }

  // Fetch transactions from the service
  getTransactions(filter: string, startdate: string, endDate: string): void {
    this.incomeExpenseService.getTransactions(filter, startdate, endDate).subscribe({
      next: (data) => {
        this.transactions = data.results;  // Assuming the data contains a 'results' property
        this.savingTotal = data.totalAmount.savingTotal;
        this.earningsTotal = data.totalAmount.earningTotal;
        this.expenseTotal = data.totalAmount.expenseTotal;
        this.amountLeft= (
          data.totalAmount.earningTotal - 
          data.totalAmount.expenseTotal - 
          data.totalAmount.savingTotal
        ).toString();
      },
      error: (err) => {
        this.loadErrorMessage = err.message;  // Set error message
        this.categories = [];  // Clear categories in case of error
      },
    });
  }


  // Submit form data

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      this.insertTransactionRecord(formData.categoryName, formData.categoryType, this.emailUrlPath, formData.shortNote, formData.transactionDate, formData.amount);
      // Call your backend service here to submit the form data
    }
  }


  // Function to open the modal
  openModal() {
    this.fetchCategories();
    this.isModalOpen = true;
  }
  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }
  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.Categories;
      },
      error: (err) => {
        this.categories = []; // Clear categories in case of error
      },
    });
  }

  onCategoryTypeChange(event: any) {
    const selectedCategory = this.categories.find(category => category.CATEGORY_NAME === event.target.value && category.CATEGORY_TYPE === this.selectedCategory_Name);
    if (selectedCategory) {
      // Set the imageURL field with the selected category's IMAGE_URL
      this.emailUrlPath = selectedCategory.IMAGE_URL;
      this.transactionForm.patchValue({
        imageURL: selectedCategory.IMAGE_URL
      });
    }
  }
  insertTransactionRecord(categoryName: string, categoryType: string, imageUrl: string, shortNote: string, transactionDate: string, amount: string) {
    this.incomeExpenseService.insertTransactionRecord(categoryName, categoryType, imageUrl, shortNote, transactionDate, amount).subscribe({
      next: (successMessage) => {
        this.successMessage = successMessage;
        // Navigate to another route after 2 seconds
        setTimeout(() => {
          this.successMessage = '';
          this.closeModal();
        }, 3000);  // 2000 ms = 2 seconds
      },
      error: (err) => {
        this.errorMessage = err.message || 'Something went wrong!'; // Set the error message
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);  // 2000 ms = 2 seconds
      },
    });
  }


  //filter ui logic
  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const filterValue = target.value; // Now safely access the value
    this.selectedFilter = filterValue;

    if (filterValue !== 'custom') {
      // Reset dates if not using custom range
      this.startDate = '';
      this.endDate = '';
    }
  }

  applyFilter(): void {
    if (this.selectedFilter === 'custom') {
      if (!this.startDate || !this.endDate) {
        alert('Please select both start and end dates.');
        return;
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        alert('Start date cannot be after end date.');
        return;
      }
    }

    const filterData = {
      filter: this.selectedFilter,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.getTransactions(filterData.filter, filterData.startDate, filterData.endDate);
    // Add logic to fetch filtered data
  }


  //delete start
  onDelete(item: string) {

    if (confirm("Are you sure to delete ?")) {

      this.incomeExpenseService.deleteRecord(item).subscribe({
        next: (successMessage) => {
          this.deleteMessage = successMessage;
          // Navigate to another route after 2 seconds
          setTimeout(() => {
            this.deleteMessage = '';
          }, 3000);  // 2000 ms = 2 seconds
          this.getTransactions('Today', '', '');
        },
        error: (err) => {
          this.deleteErrorMessage = err.message || 'Something went wrong!'; // Set the error message
          setTimeout(() => {
            this.deleteErrorMessage = '';
          }, 3000);  // 2000 ms = 2 seconds
        },

      })

    }



  }
  //delete end



}
