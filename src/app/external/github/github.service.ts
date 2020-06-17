import { Injectable } from '@angular/core';
import { URLS } from '../config';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  // url = `${URLS.base}/users/${'SebastianFlo'}/repos`;

  constructor(private apollo: Apollo) { }

  // getRepos() {
  //   return this.http.get<any>(this.url)
  //     .pipe(take(1))
  //     .subscribe(
  //         repos => {
  //           console.log('repos', repos);
  //         },
  //         error => console.log('error', error)
  //     );
  // }

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
    const comment$ = this.addCommentToIssue(issueId, body);
    const close$ = this.closeIssue(issueId);

    concat(comment$, close$)
      .subscribe(({ data }) => {
        console.log('got data', data); // set state with success / remove issue
      },(error) => {
        console.log('there was an error sending the query', error); // set error state
      });
  }
}
