import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const LOGIN_MUTATION = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private apollo: Apollo) { }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string) {
    return this.apollo.query<{ login: string }>({
      query: LOGIN_MUTATION,
      variables: { username, password },
      fetchPolicy: 'network-only'
    }).pipe(
      tap(result => {
        if (result.data?.login) {
          this.setToken(result.data.login);
        }
      })
    );
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn.next(false);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
