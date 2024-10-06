import { Component } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PrimengModule, BaseModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Home', route: '/' },
    { label: 'Docker Images', route: '/docker-images' },
    { label: 'Docker Containers', route: '/docker-containers' },
  ];

  visible: boolean = false;

  toggleSidebar() {
    this.visible = !this.visible;
  }
}
