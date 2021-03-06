import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Issue } from 'src/app/data/github/state';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { GithubService } from 'src/app/external/github/github.service';
import { StatusComponent } from '../status/status.component';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-issue',
  template: `
    <mat-card class="issue-card" cdkDrag [cdkDragData]="issue.title" [cdkDragDisabled]="disableIssue">
      <mat-card-header>
        <mat-card-title>{{ disableIssue ? resolution : issue.title }}</mat-card-title>

        <div class="example-handle" cdkDragHandle>
          <svg width="24px" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
          </svg>
        </div>

      </mat-card-header>

      <mat-card-content class="flex-layout layout-center-h layout-center-v">
        <p>{{ issue?.body }}</p>
      </mat-card-content>

      <mat-card-actions>
        <div class="flex-layout layout-center-h">
          <button [disabled]="disableIssue" mat-button color="warn" (click)="openDialog({ prompt: 'Are you sure you want to close this issue?', onok: 'Closed' })">Close</button>
          <button [disabled]="disableIssue" mat-button color="primary" (click)="openDialog({ prompt: 'Are you sure you want to resolve this issue?', onok: 'Resolved' })">Resolve</button>
          <!-- <button [disabled]="disableIssue" mat-button color="primary" (click)="testDialog()">Test</button> -->
        </div>
      </mat-card-actions>

      <mat-card *cdkDragPreview>
        <mat-card-header>
          <mat-card-title>{{ issue.title }}</mat-card-title>
        </mat-card-header>
      </mat-card>
    </mat-card>
  `,
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  @Input() issue: Issue;
  @Output() dropped: EventEmitter<Event> = new EventEmitter<Event>();

  disableIssue = false;
  resolution = '';

  constructor(public dialog: MatDialog, private githubService: GithubService) {}

  openDialog(data: any) {
    const dialogRef = this.dialog.open(ConfirmationComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (!result) {
        return;
      }

      this.closeIssue(result);
    });
  }

  // testDialog() {
  //   const loadingStatus = this.dialog.open(StatusComponent, { data: { status: 'error' } });
  // }

  closeIssue(comment: string) {

    const loadingStatus = this.dialog.open(StatusComponent, { data: { status: 'loading' } });

    this.githubService.commentAndCloseIssue(this.issue.id, comment).pipe(last())
      .subscribe(({ errors }) => {
        loadingStatus.close();

        if (errors) {
          const errorStatus = this.dialog.open(StatusComponent, { data: { status: 'error' } });

          setTimeout(() => {
            errorStatus.close();
          }, 2000)
        }


        const successStatus = this.dialog.open(StatusComponent, { data: { status: 'success' } });

        setTimeout(() => {
          successStatus.close();
          return;
        }, 2000)

        this.resolution = comment;
        this.disableIssue = true;
      },() => {
        loadingStatus.close();
        const errorStatus = this.dialog.open(StatusComponent, { data: { status: 'error' } });

        setTimeout(() => {
          errorStatus.close();
        }, 2000)
      });
  }

  ngOnInit(): void {}
}
