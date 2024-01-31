import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/region.type';


//Arreglo
// type Region = 'Africa'|'Americas'|'Asia'|'Europe'|'Oceania';

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit{

  public countries:Country[] = [];
  public regions:Region[] = ['Africa','Americas','Asia','Europe','Oceania'];
  public selectedRegion?:Region;
  public isLoading: boolean = false;

  constructor ( private CountriesService:CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.CountriesService.cacheStore.byRegion.countries;
    this.selectedRegion = this.CountriesService.cacheStore.byRegion.region;
  }

  searchByRegion( region:Region ):void {

    this.selectedRegion = region;
    this.isLoading = true;

    this.CountriesService.searchRegion( region )
    .subscribe( countries => {
      this.countries = countries;
      this.isLoading = false;
    } );
  }

}
