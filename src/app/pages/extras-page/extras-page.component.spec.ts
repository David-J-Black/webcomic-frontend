import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrasPageComponent } from './extras-page.component';

describe('ExtrasPageComponent', () => {
  let component: ExtrasPageComponent;
  let fixture: ComponentFixture<ExtrasPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtrasPageComponent]
    });
    fixture = TestBed.createComponent(ExtrasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
