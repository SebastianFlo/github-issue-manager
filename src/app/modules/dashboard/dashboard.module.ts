import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { IssueComponent } from './issue/issue.component';
import { DashboardComponent } from './dashboard.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StatusComponent } from './status/status.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DashboardComponent,
    IssueComponent,
    ConfirmationComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,

    DragDropModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [ConfirmationComponent, StatusComponent],
})
export class DashboardModule {}
