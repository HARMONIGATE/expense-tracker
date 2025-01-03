import { Component,ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardService } from '../user-dashboard/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  colors?: string[]; 
};


@Component({
  selector: 'app-earnings-expence',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './earnings-expence.component.html',
  styleUrl: './earnings-expence.component.css'
})
export class EarningsExpenceComponent {
expenseData:any[]=[];
earningData:any[]=[];

  

  @ViewChild("chart") chart!: ChartComponent; // <-- Use non-null assertion operator
  
  public chartOptions: ChartOptions;  // Removed Partial

  constructor(private dashboard:DashboardService ) {
    this.chartOptions = {
      series: [
        {
          name: "Expense",
          data: [],
          color: "#FF0000" // Red for Expense
        },
        {
          name: "Earnings",
          data: [],
          color: "#00BFFF" // Blue for Earnings
        }
      ],
      chart: {
        type: "bar",
        height: 700 // Increase chart height for more room
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%', // Increase bar height (try higher percentage values)
          dataLabels: {
            position: "center" // Keeps data labels in the middle
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val; // Show the data value
        },
        offsetX: 0, // Ensure alignment to the middle
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#000"] // Black text for better readability
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
      }
    };
    
    
  }

  ngOnInit(): void {
    this.dashboardInfo();
  }

  dashboardInfo(): void {
    this.dashboard.getDashboardInfo().subscribe({
      next: (data) => {
        // Update the series dynamically
        this.chartOptions.series = [
          {
            name: "Expense",
            data: data.yearlyExpenseList || [] // Use fallback in case of undefined
          },
          {
            name: "Earnings",
            data: data.yearlyEarningList || [] // Use fallback in case of undefined
          }
        ];
      },
      error: (err) => {
      },
    });
  }
}
