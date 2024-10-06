import { Component } from '@angular/core';
import { TableViewContainerComponent } from '../table-view-container/table-view-container.component';
import { TableViewImageComponent } from '../table-view-image/table-view-image.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableViewContainerComponent, TableViewImageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Bem-vindo ao Nautilus Control!';

  ngOnInit(): void {
  }

}
