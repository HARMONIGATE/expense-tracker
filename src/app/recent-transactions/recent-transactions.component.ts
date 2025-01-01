import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../user-dashboard/dashboard.service';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.css']
})
export class RecentTransactionsComponent {
  transactions: any[] = [];
  
constructor(private dashboard:DashboardService) { }
  ngOnInit(): void {
    this.dashboardInfo();
  }
  dashboardInfo(): void {
    this.dashboard.getDashboardInfo().subscribe({
      next: (data) => {
        this.transactions = data.recentTransaction;
      },
      error: (err) => {
        //Do nothing
      },
    });
  }


}
