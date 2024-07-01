import {AfterViewInit, Component, Input, OnInit, Output} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  searchValue: FormControl;

  constructor(private bondService: BondsService) { }

  ngOnInit(): void {
    this.searchValue = new FormControl('', [Validators.required, Validators.minLength(2)])
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges.subscribe((changes) => {
      /*console.log('changes', changes);
      console.log('this.bondService.checkInBonds()', this.bondService.checkInBonds());*/
    if (this.bondService.checkInBonds()) {
      this.bondService.searchValue.next(changes);
      console.log('searchValue', this.bondService.searchValue);
    }
    })
  }
}
