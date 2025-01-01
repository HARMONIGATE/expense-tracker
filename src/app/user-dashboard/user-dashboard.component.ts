import { Component } from '@angular/core';
import { EarningsExpenceComponent } from '../earnings-expence/earnings-expence.component';
import { EarningComponent } from '../earning/earning.component';
import { ExpenseComponent } from '../expense/expense.component';
import { RecentTransactionsComponent } from '../recent-transactions/recent-transactions.component';
import { MostExpensivePurchasesComponent } from '../most-expensive-purchases/most-expensive-purchases.component';
import { SavingsComponent } from '../savings/savings.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [EarningsExpenceComponent,EarningComponent,ExpenseComponent,RecentTransactionsComponent,MostExpensivePurchasesComponent,SavingsComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
