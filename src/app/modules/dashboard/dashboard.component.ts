import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

import { AppState } from 'src/app/data/state';
import { selectUser } from 'src/app/data/core/selectors';
import { User } from 'src/app/data/models';
import { Issue, Issues } from 'src/app/data/github/state';
import {
  selectIssues,
  selectRepositoriesIssues,
} from 'src/app/data/github/selectors';
import * as GithubActions from '../../data/github/actions';

@Component({
  selector: 'app-dashboard',
  template: `
    <div cdkDropListGroup>
      <div class="height-100">
        <h2
          class="text-title text-white flex-layout layout-center-h layout-center-v"
        >
          Good day {{ (user$ | async).name }}
        </h2>
      </div>

      <div
        id="issue-list"
        class="dashboard-issues flex-scroll-h flex-layout"
        [ngClass]="{
          'layout-space-between': issues.length > 3,
          'layout-space-around': issues.length < 4
        }"
        cdkDropList
        cdkDropListOrientation="horizontal"
        [cdkDropListData]="issues"
        (cdkDropListDropped)="drop($event)"
      >
        <div
          class="dashboard-issue flex-scroll-item"
          *ngFor="let issue of issues"
        >
          <app-issue [issue]="issue" (dropped)="drop($event)"></app-issue>
        </div>
      </div>

      <div class="background-light height-100">
        <h2
          class="text-title text-black flex-layout layout-center-h layout-center-v"
        >
          Work Log
        </h2>
      </div>

      <div
        class="dashboard-log background-light flex-layout layout-space-around"
      >
        <div class="log-container">
          <h4 class="text-subtitle">To Do</h4>

          <div
            cdkDropList
            id="todos-list"
            [cdkDropListData]="todos"
            class="log-list"
            (cdkDropListDropped)="drop($event)"
          >
            <div class="log-box" *ngFor="let todo of todos" cdkDrag>
              {{ todo.title }}
              <div class="log-custom-placeholder" *cdkDragPlaceholder></div>
            </div>
          </div>
        </div>

        <div class="log-container">
          <h4 class="text-subtitle">Doing</h4>

          <div
            cdkDropList
            id="doings-list"
            [cdkDropListData]="doings"
            class="log-list"
            (cdkDropListDropped)="drop($event)"
          >
            <div class="log-box" *ngFor="let doin of doings" cdkDrag>
              {{ doin.title }}
              <div class="log-custom-placeholder" *cdkDragPlaceholder></div>
            </div>
          </div>
        </div>

        <div class="log-container">
          <h4 class="text-subtitle">Done</h4>

          <div
            cdkDropList
            id="dones-list"
            [cdkDropListData]="dones"
            class="log-list"
            (cdkDropListDropped)="drop($event)"
          >
            <div class="log-box" *ngFor="let done of dones" cdkDrag>
              {{ done.title }}
              <div class="log-custom-placeholder" *cdkDragPlaceholder></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<User>;
  issues$: Observable<Issues>;

  TestIssuesQuery = gql`
    {
      repository(owner: "octocat", name: "Hello-World") {
        issues(last: 20, states: CLOSED) {
          edges {
            node {
              title
              url
              body
              repository {
                name
                description
                resourcePath
              }
            }
          }
        }
      }
    }
  `;

  MyRepoIssuesQuery = gql`
    {
      viewer {
        repositories(last: 10) {
          edges {
            node {
              name
              issues(last: 10, states: OPEN) {
                edges {
                  node {
                    title
                    body
                    id
                    resourcePath
                    repository {
                      name
                      description
                      resourcePath
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  issues: Issue[] = [];
  todos = [{ title: 'log Issue 1' }, { title: 'log Issue 2' }];
  doings = [{ title: 'log Issue 3' }, { title: 'log Issue 4' }];
  dones = [{ title: 'log Issue 5' }];

  constructor(private apollo: Apollo, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(selectUser));
    // this.getIssues();
    this.getRepos();
  }

  getRepos() {
    this.issues$ = this.store.pipe(select(selectRepositoriesIssues));
    this.issues$.subscribe(
      (issues) => (this.issues = issues.edges.map((issue) => issue.node))
    );

    this.apollo
      .watchQuery({
        query: this.MyRepoIssuesQuery,
      })
      .valueChanges.subscribe((result: any) => {
        const repos = result.data && result.data.viewer.repositories;

        this.store.dispatch(GithubActions.SetRepos({ payload: repos }));
      });
  }

  getIssues() {
    this.issues$ = this.store.pipe(select(selectIssues));
    this.issues$.subscribe(
      (issues) => (this.issues = issues.edges.map((issue) => issue.node))
    );
    this.apollo
      .watchQuery({
        query: this.TestIssuesQuery,
      })
      .valueChanges.subscribe((result: any) => {
        const issues = result.data && result.data.repository.issues;
        this.store.dispatch(GithubActions.SetIssues({ payload: issues }));
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('drop', event.item);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
