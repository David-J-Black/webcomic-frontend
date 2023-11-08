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

}
