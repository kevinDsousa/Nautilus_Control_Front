import { Component, Input } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [PrimengModule, BaseModule],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {
    @Input() data: any[] = [];
    @Input() columns: { field: string; header: string }[] = [];
}
