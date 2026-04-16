import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);

  protected readonly title = signal('task5');

  // ── Overlay state ────────────────────────────────
  showSignup = false;
  showLogin = false;

  // ── Signup fields ────────────────────────────────
  signupFirstName = '';
  signupLastName = '';
  signupEmail = '';
  signupPassword = '';
  signupError = '';
  signupSuccess = '';
  passwordStrength = '';

  // ── Login fields ─────────────────────────────────
  loginEmail = '';
  loginPassword = '';
  loginError = '';

  // ── Auth state ───────────────────────────────────
  isLoggedIn = false;
  loggedInFirstName = '';

  // Registered users stored locally (simulates a database)
  // In a real app this would live in a Django/backend database
  private registeredUsers: { firstName: string, lastName: string, email: string, password: string }[] = [];

  // ── Weather ──────────────────────────────────────
  weather: any = null;
  weatherError = '';

  ngOnInit() {
    this.fetchWeather();
  }

  // ── Weather API ───────────────────────────────────
  fetchWeather() {
    this.http.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: '3.1390',
        longitude: '101.6869',
        current_weather: 'true'
      }
    }).subscribe({
      next: (data: any) => {
        this.weather = data.current_weather;
      },
      error: () => {
        this.weatherError = 'Could not load weather data.';
      }
    });
  }

  getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 2) return '⛅';
    if (code <= 48) return '☁️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    return '⛈️';
  }

  // ── Overlay controls ──────────────────────────────
  openSignup() {
    this.showLogin = false;
    this.showSignup = true;
    this.clearSignupFields();
  }

  openLogin() {
    this.showSignup = false;
    this.showLogin = true;
    this.clearLoginFields();
  }

  closeOverlay() {
    this.showSignup = false;
    this.showLogin = false;
  }

  // ── Sign Up ───────────────────────────────────────
  getPasswordStrength(password: string): string {
    if (!password) return '';
    if (password.length < 8) return 'Too short';
    if (password.length > 20) return 'Too long';
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (hasUpper && hasNumber) return 'Strong';
    if (hasUpper || hasNumber) return 'Medium';
    return 'Weak';
  }

  onPasswordInput(value: string) {
    this.signupPassword = value;
    this.passwordStrength = this.getPasswordStrength(value);
  }

  submitSignup() {
    this.signupError = '';
    this.signupSuccess = '';

    if (!this.signupFirstName || !this.signupLastName || !this.signupEmail || !this.signupPassword) {
      this.signupError = 'All fields are required.';
      return;
    }

    if (this.signupPassword.length < 8 || this.signupPassword.length > 20) {
      this.signupError = 'Password must be 8–20 characters.';
      return;
    }

    const alreadyExists = this.registeredUsers.find(u => u.email === this.signupEmail);
    if (alreadyExists) {
      this.signupError = 'An account with this email already exists.';
      return;
    }

    // Register the user
    this.registeredUsers.push({
      firstName: this.signupFirstName,
      lastName: this.signupLastName,
      email: this.signupEmail,
      password: this.signupPassword
    });

    this.signupSuccess = 'Account created! You can now log in.';
    setTimeout(() => {
      this.openLogin();
    }, 1500);
  }

  // ── Login ─────────────────────────────────────────
  submitLogin() {
    this.loginError = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Please enter your email and password.';
      return;
    }

    const emailExists = this.registeredUsers.find(u => u.email === this.loginEmail);
    if (!emailExists) {
      this.loginError = 'No account found with this email. Please sign up first.';
      return;
    }

    const validUser = this.registeredUsers.find(
      u => u.email === this.loginEmail && u.password === this.loginPassword
    );
    if (!validUser) {
      this.loginError = 'Incorrect password.';
      return;
    }

    // Login success
    this.isLoggedIn = true;
    this.loggedInFirstName = validUser.firstName;
    this.closeOverlay();
  }

  logout() {
    this.isLoggedIn = false;
    this.loggedInFirstName = '';
    this.clearLoginFields();
  }

  // ── Contact Modal ─────────────────────────────────
  openModal() {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const message = (document.getElementById('message') as HTMLTextAreaElement).value;

    if (!name || !email || !message) {
      (document.getElementById('contactForm') as HTMLFormElement).reportValidity();
      return;
    }

    document.getElementById('modalName')!.textContent = name;
    document.getElementById('modalEmail')!.textContent = email;
    document.getElementById('modalMessage')!.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
  }

  // ── Helpers ───────────────────────────────────────
  private clearSignupFields() {
    this.signupFirstName = '';
    this.signupLastName = '';
    this.signupEmail = '';
    this.signupPassword = '';
    this.signupError = '';
    this.signupSuccess = '';
    this.passwordStrength = '';
  }

  private clearLoginFields() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.loginError = '';
  }
}