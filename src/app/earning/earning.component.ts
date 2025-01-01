import { Component } from '@angular/core';
import { DashboardService } from '../user-dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-earning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earning.component.html',
  styleUrl: './earning.component.css'
})
export class EarningComponent {

  totalEarning:string='';
  constructor(private dashboard:DashboardService) { }
  ngOnInit(): void {
    this.dashboardInfo();
  }
  dashboardInfo(): void {
    this.dashboard.getDashboardInfo().subscribe({
      next: (data) => {
        this.totalEarning = data.earningSum;
      },
      error: (err) => {
        //Do nothing
      },
    });
  }
}
