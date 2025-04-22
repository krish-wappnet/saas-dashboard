import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { } from 'ng2-charts';
import { ApiService } from '../../services/api.service';
import { NgChartsModule } from 'ng2-charts';
import { UsageData } from '../../models';
import { ChartOptions, ChartData } from 'chart.js';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, TranslateModule],
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements OnInit {
  usageData: UsageData[] = [];
  selectedOrgId: number | null = null;
  dateRange = { start: '2025-04-01', end: '2025-04-30' };
  chartData: ChartData = {
    labels: [],
    datasets: [
      { label: 'API Calls', data: [] },
      { label: 'Active Users', data: [] },
      { label: 'Storage (GB)', data: [] }
    ]
  };
  chartOptions: ChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.selectedOrgId = 1; // Temporary
    this.loadUsageData();
  }

  loadUsageData() {
    if (this.selectedOrgId) {
      this.apiService.getUsageData(this.selectedOrgId, this.dateRange).subscribe({
        next: (data) => {
          this.usageData = data;
          this.updateChart();
        }
      });
    }
  }

  updateChart() {
    this.chartData.labels = this.usageData.map(d => d.date);
    this.chartData.datasets[0].data = this.usageData.map(d => d.apiCalls);
    this.chartData.datasets[1].data = this.usageData.map(d => d.activeUsers);
    this.chartData.datasets[2].data = this.usageData.map(d => d.storage);
  }

  exportCSV() {
    const csv = this.usageData.map(d => `${d.date},${d.apiCalls},${d.activeUsers},${d.storage}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage-data.csv';
    a.click();
  }
}