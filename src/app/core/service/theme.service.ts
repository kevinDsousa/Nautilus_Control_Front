import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  theme$: Subject<string> = new Subject<string>();
  selectedTheme: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchThemeMode(theme: string) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme === 'light'
          ? '/assets/css/theme.css'
          : '/assets/css/dark-theme.css';

      localStorage.setItem('theme', theme);
      this.selectedTheme = theme;
      this.theme$.next(theme);
    }
  }
}
