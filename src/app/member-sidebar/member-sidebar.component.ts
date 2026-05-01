import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { OilService } from '../oil.service';
@Component({
  selector: 'app-member-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './member-sidebar.component.html',
  styleUrls: ['./member-sidebar.component.scss']
})
export class MemberSidebarComponent {
  constructor(private router: Router, private oilService: OilService) {}

  logout() {
    this.oilService.clearCart();  // ← 新增
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
