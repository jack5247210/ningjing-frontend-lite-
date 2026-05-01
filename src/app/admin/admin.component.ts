import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    this.router.navigateByUrl('/login');
  }
}
