import { Injectable } from '@angular/core';
import { URLS } from '../config';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  url = `${URLS.base}/users/${'SebastianFlo'}/repos`;

  constructor(private http: HttpClient) { }

  getRepos() {
    return this.http.get<any>(this.url)
      .pipe(take(1))
      .subscribe(
          repos => {
            console.log('repos', repos);
          },
          error => console.log('error', error)
      );
  }
}
