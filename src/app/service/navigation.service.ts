import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  constructor() { }

  goToAboutPage() {
    const url = `about`;
    window.location.replace(url);
  }

  goToTableOfContents() {
    const url = `table-of-contents`;
    window.location.replace(url);
  }

}
