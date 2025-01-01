import { Component } from '@angular/core';
import { DashboardService } from '../user-dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css'
})
export class SavingsComponent {

  totalSaving:string='';


  constructor(private dashboard:DashboardService) { }


  ngOnInit(): void {
    this.dashboardInfo();
  }

  dashboardInfo(): void {
    this.dashboard.getDashboardInfo().subscribe({
      next: (data) => {
        this.totalSaving = data.savingSum;
      },
      error: (err) => {
        //Do nothing
      },
    });
  }

}
