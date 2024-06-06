import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBondComponent } from './info-bond.component';

describe('InfoBondComponent', () => {
  let component: InfoBondComponent;
  let fixture: ComponentFixture<InfoBondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoBondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
