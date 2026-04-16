import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task5');

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
}