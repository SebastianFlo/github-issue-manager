import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-status',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content class="mat-typography status-content">
      <div *ngIf="data.status === 'loading'">
          <mat-progress-spinner
            diameter="50"
            mode="indeterminate"
          ></mat-progress-spinner>
        </div>

        <div *ngIf="data.status === 'success'">
          Action performed succesfully 😀
        </div>

        <div *ngIf="data.status === 'error'">
          Something went wrong 😞
        </div>

    </mat-dialog-content>
  `,
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  title: 'Loading';
  titleStatus = {
    loading: 'Loading',
    success: 'Success',
    error: 'Error',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.titleStatus[data.status];
  }

  ngOnInit(): void {}
}
