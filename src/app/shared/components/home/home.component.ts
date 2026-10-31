import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewContainerComponent } from '../table-view-container/table-view-container.component';
import { TableViewImageComponent } from '../table-view-image/table-view-image.component';
import { HostContextService } from '../../../core/service/host-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TableViewContainerComponent, TableViewImageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = '';
  activeHostId: string | null = null;

  private hostSubscription?: Subscription;

  constructor(private hostContextService: HostContextService) {}

  ngOnInit(): void {
    this.hostSubscription = this.hostContextService.activeHostId$.subscribe(id => this.activeHostId = id);
  }

  ngOnDestroy(): void {
    this.hostSubscription?.unsubscribe();
  }
}
