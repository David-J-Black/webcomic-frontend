import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../service/localStorage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'cmc-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit{

  pageOptions=[1, 3, 5, 10, 20];
  selectedNumber: number = 3;

  constructor(
      private _localStorageService: LocalStorageService,
      private _router: Router
  ) {}

  ngOnInit(): void {
    this.selectedNumber = this._localStorageService.getComicsPerPage();
  }

  emitSelection() {
    console.debug(this.selectedNumber);
    this._localStorageService.setComicsPerPage(this.selectedNumber);
  }

}
