import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistInformationComponent } from './artist-information.component';

describe('ArtistInformationComponent', () => {
  let component: ArtistInformationComponent;
  let fixture: ComponentFixture<ArtistInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
