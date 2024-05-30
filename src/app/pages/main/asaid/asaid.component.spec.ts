import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsaidComponent } from './asaid.component';

describe('AsaidComponent', () => {
  let component: AsaidComponent;
  let fixture: ComponentFixture<AsaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsaidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
