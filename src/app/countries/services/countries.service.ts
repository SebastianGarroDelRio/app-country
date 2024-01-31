import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})

export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  public cacheStore: CacheStore = {
    byCapital:    { term: '' , countries: [] },
    byCountries:  { term: '' , countries: [] },
    byRegion:     { region: '' , countries: [] },
   }

  constructor( private http: HttpClient ) {
    this.loadFromLocalStorage();
  }

  // Metodo para persistir la data en LocalStorage
  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ));
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')!);
  }

  // Metodo para optimizar
  private getCountriesRequest( url:string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) ),
        delay( 1000 ),
      )
  }

  //metodo para buscar y retornar el country posicion 0 (primero) y si no existe 'null'
  searchCountryByAlphaCode( code: string ):Observable<Country | null> {
    const url = `${ this.apiUrl }/alpha/${ code }`
    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError( () => of(null) )
      );
  }

  //metodo filtrar por capital
  searchCapital( term:string ):Observable<Country[]> {
    const url = `${ this.apiUrl }/capital/${ term }`
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term: term, countries: countries } ),
        tap( () => this.saveToLocalStorage() ),
      );
  }

  //metodo filtrar por country
  searchCountry( country:string ):Observable<Country[]> {
    const url = `${ this.apiUrl }/name/${ country }`
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term: country, countries: countries } ),
        tap( () => this.saveToLocalStorage() ),
      );
  }

  //metodo filtrar por region
  searchRegion( region:Region ):Observable<Country[]> {
    const url = `${ this.apiUrl }/region/${ region }`
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region: region, countries: countries }),
        tap( () => this.saveToLocalStorage() ),
      );
  }

}
