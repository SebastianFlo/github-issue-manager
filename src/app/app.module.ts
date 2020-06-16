import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';

import { LoginModule } from './modules/login/login.module';
import { AuthenticationService } from './external/auth/authentication.service';
import { StoreModule } from '@ngrx/store';
import { CoreReducer } from './data/core/reducer';
import { TokenInterceptor } from './external/auth/authentication.interceptor';
import { GithubService } from './external/github/github.service';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GithubReducer } from './data/github/reducer';
import { metaReducers } from './data/meta.reducers';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // NoopAnimationsModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    // Modules
    LoginModule,
    StoreModule.forRoot({
      core: CoreReducer,
      github: GithubReducer
    }, {
      metaReducers: metaReducers
    })

  ],
  providers: [
    AuthenticationService,
    GithubService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://api.github.com/graphql'
          })
        }
      },
      deps: [HttpLink]
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
