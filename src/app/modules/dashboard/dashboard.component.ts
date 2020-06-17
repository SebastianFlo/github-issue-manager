import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/data/state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/data/core/selectors';
import * as GithubActions from '../../data/github/actions';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/data/models';
import { Issue, Issues } from 'src/app/data/github/state';
import { selectIssues } from 'src/app/data/github/selectors';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CdkDragDrop, copyArrayItem, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  template: `
    <div cdkDropListGroup>
    <div class="background-light height-100">
      <h2 class="text-title flex-layout layout-center-h layout-center-v">
        Good day {{ (user$ | async).name }}
      </h2>
    </div>

    <!-- {{ this.issues$ | async | json }} -->

    <div id="issue-list" class="dashboard-issues flex-scroll-h flex-layout layout-space-between"
      cdkDropList cdkDropListOrientation="horizontal"
      [cdkDropListData]="issues"
      (cdkDropListDropped)="drop($event)">
      <div class="dashboard-issue flex-scroll-item" *ngFor="let issue of issues">
        <app-issue [issue]="issue" (dropped)="drop($event)"></app-issue>
      </div>
    </div>

    <div class="background-light height-100">
    <h2 class="text-title flex-layout layout-center-h layout-center-v">
      Work Log
    </h2>
  </div>

    <div class="dashboard-log background-light flex-layout layout-space-around">

      <div class="example-container">
        <h4 class="text-subtitle">To Do</h4>

        <div
          cdkDropList
          id="todos-list"
          [cdkDropListData]="todos"
          class="example-list"
          (cdkDropListDropped)="drop($event)">
          <div class="example-box" *ngFor="let todo of todos" cdkDrag>{{ todo.title }}
            <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
          </div>
        </div>
      </div>

      <div class="example-container">
        <h4 class="text-subtitle">Doing</h4>

        <div
          cdkDropList
          id="doings-list"
          [cdkDropListData]="doings"
          class="example-list"
          (cdkDropListDropped)="drop($event)">
          <div class="example-box" *ngFor="let doin of doings" cdkDrag>{{ doin.title }}
            <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
          </div>
        </div>
      </div>

      <div class="example-container">
        <h4 class="text-subtitle">Done</h4>

        <div
          cdkDropList
          id="dones-list"
          [cdkDropListData]="dones"
          class="example-list"
          (cdkDropListDropped)="drop($event)">
          <div class="example-box" *ngFor="let done of dones" cdkDrag>{{ done.title }}
            <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
          </div>
        </div>
      </div>

    <!--
      <div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
        <div class="example-box" *ngFor="let issue of this.issues" cdkDrag>
          <app-issue [issue]="issue"></app-issue>
        </div>
      </div>
    -->
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
    repository(owner:"octocat", name:"Hello-World") {
      issues(last:20, states:CLOSED) {
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
            issues(last: 10) {
              edges {
                node {
                  title
                  body
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
  // issues = [
  //   {
  //     title: '[Fix] UI: Email width on mobile',
  //     body: 'Could make the font a bit smaller on mobile',
  //     resourcePath: '/SebastianFlo/nuxt-panteon-project/issues/2',
  //     repository: {
  //       name: 'nuxt-panteon-project',
  //       description:
  //         'Playing with Nuxt to create a static site for a construction company',
  //       resourcePath: '/SebastianFlo/nuxt-panteon-project',
  //     },
  //   },
  //   {
  //     title: '[Feature] Migrate REST to GraphQL',
  //     resourcePath: '/SebastianFlo/github-issue-manager/issues/1',
  //     body: 'Probably something we should consider 😄 ',
  //     repository: {
  //       name: 'github-issue-manager',
  //       description:
  //         'Developer workflow dashboard. List issues/tasks assigned to you and individually mark them as closed/resolved.',
  //       resourcePath: '/SebastianFlo/github-issue-manager',
  //       __typename: 'Repository',
  //     },
  //   },
  //   {
  //     title: '[Bug] Fix Internet Explorer Layout',
  //     resourcePath: '/SebastianFlo/github-issue-manager/issues/2',
  //     body: 'Looks a bit weird in Internet Explorer 6',
  //     repository: {
  //       name: 'github-issue-manager',
  //       description:
  //         'Developer workflow dashboard. List issues/tasks assigned to you and individually mark them as closed/resolved.',
  //       resourcePath: '/SebastianFlo/github-issue-manager',
  //       __typename: 'Repository',
  //     },
  //   },
  // ];

  todos = [
    {title: 'Example Issue 1' },
    {title: 'Example Issue 2' },
  ];
  doings = [
    {title: 'Example Issue 3' },
    {title: 'Example Issue 4' },
  ];
  dones = [
    {title: 'Example Issue 5' },
  ];

  constructor(private apollo: Apollo, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(selectUser));
    this.issues$ = this.store.pipe(select(selectIssues));

    this.issues$.subscribe(issues => this.issues = issues.edges.map(issue => issue.node));

    this.getRepos();
  }

  getRepos() {
    // this.apollo
    //   .watchQuery({
    //     query: gql`
    //       {
    //         viewer {
    //           repositories(last: 10) {
    //             edges {
    //               node {
    //                 name
    //                 issues(last: 10) {
    //                   edges {
    //                     node {
    //                       title
    //                       body
    //                       resourcePath
    //                       repository {
    //                         name
    //                         description
    //                         resourcePath
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     `,
    //   })
    //   .valueChanges.subscribe((result: any) => {
    //     const repos = result.data && result.data.viewer.repositories;

    //     this.store.dispatch(GithubActions.SetRepos({ payload: repos }));
    //   });

      this.apollo
      .watchQuery({
        query: this.TestIssuesQuery
      })
      .valueChanges.subscribe((result: any) => {
        const issues = result.data && result.data.repository.issues;
        this.store.dispatch(GithubActions.SetIssues({ payload: issues }));
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('drop', event.item);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    }
  }
}
