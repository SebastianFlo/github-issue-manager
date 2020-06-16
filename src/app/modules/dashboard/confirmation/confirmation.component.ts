import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  template: `
    <h2 mat-dialog-title>Just double checking</h2>
    <mat-dialog-content class="mat-typography">
      <p>{{ data.prompt }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="data.onok" cdkFocusInitial>
        Yes
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
