import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/external/auth/authentication.service';
import { first, catchError, map, delay, tap } from 'rxjs/operators';
import { AppState } from 'src/app/data/state';
import { Store, select } from '@ngrx/store';
import * as CoreActions from '../../data/core/actions';
import * as GithubActions from '../../data/github/actions';
import { Observable, Subscription } from 'rxjs';
import { selectToken } from 'src/app/data/core/selectors';
import { GithubService } from 'src/app/external/github/github.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Repos, Repo } from 'src/app/data/github/state';
import { selectReposWithIssues } from 'src/app/data/github/selectors';
import { User } from 'src/app/data/models';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex-layout layout-center-v layout-center-h">
      <mat-card class="login-card">
        <mat-card-header *ngIf="!user.name">
          <mat-card-title>Github Token</mat-card-title>
          <mat-card-subtitle
            >Enter an existing Github token or create one on
            <a target="new" href="https://github.com"
              >Github</a
            ></mat-card-subtitle
          >
        </mat-card-header>

        <mat-card-content class="flex-layout layout-center-h layout-center-v">
          <div *ngIf="!user.name && !error" class="token-form">
            <mat-form-field class="input-full-width">
              <input
                [formControl]="authToken"
                class="input-full-width"
                matInput
                placeholder="Ex. ff34885a8624460a855540c6592698d2f1812843"
                value=""
              />
            </mat-form-field>

            <div
              *ngIf="authToken.errors?.pattern"
              class="flex-layout layout-center-h text-warning"
            >
              Token pattern is invalid
            </div>
          </div>

          <div *ngIf="error" class="error-form">
            <div class="flex-layout layout-center-h layout-center-v">
              <div class="flex-layout layout-center-h text-center">
                <h3>Something went wrong 🔌</h3>
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="user && user.name" class="welcome-form">
            <div class="flex-layout layout-center-h layout-center-v">
              <div>
                <h3>Welcome {{ user?.name }} 😊</h3>
              </div>
            </div>
          </div>

          <div
            *ngIf="loading && !error"
            class="flex-layout layout-center-h layout-center-v"
          >
            <mat-progress-spinner
              diameter="50"
              mode="indeterminate"
            ></mat-progress-spinner>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <div
            *ngIf="!user.name && !loading"
            class="flex-layout layout-center-h"
          >
            <button
              [disabled]="!authToken.dirty || authToken.invalid"
              mat-button
              (click)="addToken()"
            >
              LOGIN
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>

    <!--
    <h2>Set Token</h2>
    {{ token$ | async }}
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="accessToken">Access Token</label>
        <input
          type="text"
          formControlName="accessToken"
          class="form-control"
          [ngClass]="{ 'is-invalid': submitted && f.accessToken.errors }"
        />
        <div *ngIf="submitted && f.accessToken.errors" class="invalid-feedback">
          <div *ngIf="f.accessToken.errors.required">
            accessToken is required
          </div>
        </div>
      </div>

      <div class="form-group">
        <button [disabled]="loading" class="btn btn-primary">
          <span
            *ngIf="loading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Set Token
        </button>
        {{ this.reposWithIssues$ | async | json }}
      </div>
    </form>

    <button (click)="getRepos()" class="btn btn-primary">
      <span class="spinner-border spinner-border-sm mr-1"></span>
      Get Repos
    </button>
    -->
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // token$: Observable<string>;
  // reposWithIssues$: Observable<Repo[]>;

  authToken = new FormControl('');
  success = true;
  // submitted = false;
  loginSubscription: Subscription;
  loading = false;
  error = false;
  errorMessage = '';
  user: User = { name: '', login: '' };
  // repos: Repos = { edges: [] };
  // returnUrl: string;


  LoginQuery = gql`
    {
      viewer {
        login
        name
      }
    }
  `;

  constructor(
    // private formBuilder: FormBuilder,
    // private route: ActivatedRoute,
    private router: Router,
    // private authenticationService: AuthenticationService,
    private store: Store<AppState>,
    private apollo: Apollo // private alertService: AlertService
  ) // private githubService: GithubService
  {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
    // this.token$ = store.pipe(select(selectToken));
    // this.reposWithIssues$ = store.pipe(select(selectReposWithIssues));
  }

  ngOnInit() {
    this.authToken.setValidators([
      Validators.required,
      Validators.pattern('[0-9a-fA-F]{40}'),
    ]);
  }

  addToken() {
    this.loading = true;
    this.store.dispatch(
      CoreActions.SetToken({ payload: this.authToken.value })
    );

    this.loginSubscription = this.apollo
      // .watchQuery({
      //   query: gql`
      //     {
      //       viewer {
      //         login
      //         name
      //       }
      //     }
      //   `,
      // })
      .watchQuery({
        query: this.LoginQuery
      })
      .valueChanges
      .pipe(
        map(({ data }: { data: any}) => {
          this.user = data && data.viewer;
          this.store.dispatch(CoreActions.SetUser({ payload: this.user }));
          // setTimeout(() => {
          //   this.router.navigate(['dashboard']);
          // }, 2 * 1e3);
        }),
        catchError((err) => {
          this.error = true
          this.errorMessage = err.message;
          throw 'error in login. Details: ' + err;
        }),
        delay(2 * 1E3),
        tap(() => {
          this.router.navigate(['dashboard']);
        })
      ).subscribe();


      // .subscribe((result: any) => {
      //   if(!result.data) {
      //     this.error = true;
      //     this.errorMessage = result.message;
      //     return;
      //   }

      //   this.user = result.data && result.data.viewer;
      //   this.store.dispatch(CoreActions.SetUser({ payload: this.user }));

      //   setTimeout(() => {
      //     this.router.navigate(['dashboard']);
      //   }, 2 * 1e3);
      // })

  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
