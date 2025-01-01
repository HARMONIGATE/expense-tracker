import { Component } from '@angular/core';
import { DashboardService } from '../user-dashboard/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-most-expensive-purchases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-expensive-purchases.component.html',
  styleUrl: './most-expensive-purchases.component.css'
})
export class MostExpensivePurchasesComponent {

  transactions: any[] = [];
    
  constructor(private dashboard:DashboardService) { }
    ngOnInit(): void {
      this.dashboardInfo();
    }
    dashboardInfo(): void {
      this.dashboard.getDashboardInfo().subscribe({
        next: (data) => {
          this.transactions = data.expenssiveTransaction;
        },
        error: (err) => {
          //Do nothing
        },
      });
    }
  

}
