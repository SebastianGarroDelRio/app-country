import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  constructor( private CountriesService:CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.CountriesService.cacheStore.byCountries.countries;
    this.initialValue = this.CountriesService.cacheStore.byCountries.term;
  }

  searchByCountry( country:string ):void {

    this.isLoading = true;

    this.CountriesService.searchCountry( country )
    .subscribe( countries => {
      this.countries = countries;
      this.isLoading = false;
    } );
  }


}
