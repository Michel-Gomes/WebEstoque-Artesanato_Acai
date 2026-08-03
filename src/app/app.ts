import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/layout/navbar/navbar';
import { Sidebar } from './components/layout/sidebar/sidebar';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Web-Estoque');
}
