import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html'
})
export class AdminLayout implements OnInit {
  readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (!this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
    }
  }

  onLogout() {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
}
