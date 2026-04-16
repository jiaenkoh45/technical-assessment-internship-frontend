import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('https://your-api.com/auth/login', {
      email,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token); // save token on success
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // true if token exists
  }
}