import { Component } from '@angular/core';
import { IMAGES } from '@shared/constants/images.constants';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly images = IMAGES;
  readonly currentYear = new Date().getFullYear();
}
