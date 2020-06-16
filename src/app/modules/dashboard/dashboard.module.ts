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



@NgModule({
  declarations: [DashboardComponent, IssueComponent, ConfirmationComponent],
  imports: [
    CommonModule,

    DragDropModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
  ],
  entryComponents: [ConfirmationComponent]
})
export class DashboardModule { }
