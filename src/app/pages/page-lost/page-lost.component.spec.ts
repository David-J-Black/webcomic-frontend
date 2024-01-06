import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLostComponent } from './page-lost.component';

describe('PageLostComponent', () => {
  let component: PageLostComponent;
  let fixture: ComponentFixture<PageLostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageLostComponent]
    });
    fixture = TestBed.createComponent(PageLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
