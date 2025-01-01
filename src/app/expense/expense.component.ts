import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../user-dashboard/dashboard.service';
@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule], // Add required modules here
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'], // Corrected from 'styleUrl' to 'styleUrls'
})
export class ExpenseComponent {
  totalExpense:string='';

  constructor(private dashboard:DashboardService) { }
  ngOnInit(): void {
    this.dashboardInfo();
  }
  dashboardInfo(): void {
    this.dashboard.getDashboardInfo().subscribe({
      next: (data) => {
        this.totalExpense = data.expenseSum;
      },
      error: (err) => {
        //Do nothing
      },
    });
  }

}
