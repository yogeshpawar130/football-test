import { Injectable } from '@angular/core';
import { FixtureObject, StandingObject, cache } from '../model/football.model';
import { Observable, Subject, of } from 'rxjs';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService  {
  cacheData = new Map<string, cache>();
  standingApiResponseOb?: Subject<StandingObject>;
  fixtureApiResponseOb?: Subject<FixtureObject>;
  currentYear: Date | number;
  // private apiKey = '8e35709ed13b03a7a1660f8345457a67'; 
  private apiKey= '1cd33705b4msh20a1c8705a3649ep184fccjsnc9cfb7101fe7';
  x_rapidoapi_host   = 'api-football-v1.p.rapidapi.com'
  private apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/  ';
  lastgames = 10;
  constructor(private http:HttpClient) {
    // this.currentYear = (new Date()).getFullYear();
    this.currentYear = 2019;
  }

  getStandingData(leagueid:number): Observable<StandingObject> {
    if (this.cacheData.has("statndingdata")) {
      return of(this.cacheData.get("statndingdata") as StandingObject)
    } else {
      if (this.standingApiResponseOb) {
        return this.standingApiResponseOb;
      } else {
        this.standingApiResponseOb = new Subject<StandingObject>();
      const headers = new HttpHeaders({
        'x-rapidapi-host' : this.x_rapidoapi_host,
        'x-rapidapi-key': this.apiKey
      });
      this.http.get<StandingObject>(`${this.apiUrl}standings?league=${leagueid}&season=${this.currentYear}`, { headers }).subscribe(
        data => {
          if (Object.keys(data.errors).length == 0) {
            this.cacheData.set("statndingdata", data);
          }
          setTimeout(() => {
            this.standingApiResponseOb?.next(data);
            this.standingApiResponseOb?.complete();
            this.standingApiResponseOb = undefined;
          }, 100);
        });
      }
      return this.standingApiResponseOb;
    }
  }

  getFixtureResult(leagueid:number,teamsid:number): Observable<FixtureObject> {
    if (this.cacheData.has("fixturedata")) {
      return of(this.cacheData.get("fixturedata") as FixtureObject);
    } else {
      if (this.fixtureApiResponseOb) {
        return this.fixtureApiResponseOb;
      } else {
        this.fixtureApiResponseOb = new Subject<FixtureObject>();
      const headers = new HttpHeaders({
        'x-rapidapi-host' : this.x_rapidoapi_host,
        'x-rapidapi-key': this.apiKey
      });
      this.http.get<FixtureObject>(`${this.apiUrl}fixtures?league=${leagueid}&season=${this.currentYear}&team=${teamsid}&last=${this.lastgames}`, { headers }).subscribe(
        data => {
          if (Object.keys(data.errors).length == 0) {
          this.cacheData.set("fixturedata", data);
          }
          setTimeout(() => {
            this.fixtureApiResponseOb?.next(data);
            this.fixtureApiResponseOb?.complete();
            this.fixtureApiResponseOb = undefined;
          }, 100);
        });
      }
      return this.fixtureApiResponseOb;
    }
  }

}
