import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-toastr" [ngClass]="getToastClasses">
      <div class="toast-title" *ngIf="title">{{ title }}</div>
      <div class="toast-message" *ngIf="message">{{ message }}</div>
      <button *ngIf="options.closeButton" class="toast-close-button" (click)="remove()">×</button>
      <div *ngIf="options.progressBar" class="toast-progress" [style.width]="width + '%'"></div>
    </div>
  `,
  styles: [`
    /* Base styles for visibility */
    .custom-toastr {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      color: white;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: relative;
      min-width: 200px;
      z-index: 10000; /* High z-index to avoid overlap */
      margin-top: 80px; /* Push below navbar */
      border: 2px solid green; /* Debug border */
    }
    /* Success toast */
    .custom-toastr.toast-success {
      background-color: #10b981; /* Green (Tailwind bg-green-500) */
    }
    /* Error toast */
    .custom-toastr.toast-error {
      background-color: #ef4444; /* Red (Tailwind bg-red-500) */
    }
    .toast-title {
      font-weight: 600;
      margin-right: 8px;
    }
    .toast-message {
      font-weight: 400;
    }
    .toast-close-button {
      color: white;
      opacity: 0.8;
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      margin-left: auto;
    }
    .toast-close-button:hover {
      opacity: 1;
    }
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: white;
      opacity: 0.8;
      transition: width linear;
    }
  `]
})
export class CustomToastComponent extends Toast implements OnInit {
  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
    console.log('CustomToastComponent initialized:', {
      title: this.title,
      message: this.message,
      type: this.toastPackage.toastType,
      options: this.options,
      classes: this.getToastClasses
    });
  }

  ngOnInit() {
    console.log('CustomToastComponent rendered in DOM with classes:', this.getToastClasses);
  }

  get getToastClasses(): string {
    const typeClass = this.toastPackage.toastType === 'toast-success'
      ? 'toast-success'
      : this.toastPackage.toastType === 'toast-error'
      ? 'toast-error'
      : '';
    const customClass = this.options.toastClass || '';
    return `${typeClass} ${customClass}`.trim();
  }
}