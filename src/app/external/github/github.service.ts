import { Injectable } from '@angular/core';
import { URLS } from '../config';
import { take, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private apollo: Apollo) { }

  commentMutation(issueId: string, body: string) {
    return `mutation {
        addComment(input:{
          subjectId: "${issueId}",
          body:"${body}"
        }) {
          clientMutationId
        }
    }`
  }

  closeMutation(issueId: string) {
    return `mutation {
      closeIssue(input: { issueId: "${issueId}" }) {
        issue {
          id
        }
      }
    }`
  }

  addCommentToIssue(issueId: string, body: string) {
    const mutation = gql`${this.commentMutation(issueId, body)}`;

    return this.apollo.mutate({
      mutation
    });
  }

  closeIssue(issueId: string) {
    const mutation = gql`${this.closeMutation(issueId)}`;

    return this.apollo.mutate({
      mutation
    });
  }

  commentAndCloseIssue(issueId: string, body: string) {
    const comment$ = this.addCommentToIssue(issueId, body).pipe(catchError(error => { throw error }));
    const close$ = this.closeIssue(issueId).pipe(catchError(error => { throw error }));

    return concat(comment$, close$);
  }
}
