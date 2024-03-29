import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/api-models/user.model';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ShowShoppingCart } from '../models/api-models/show-shopping-basket.model';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUri = 'https://localhost:44307';

  private currentKorisnikSource = new ReplaySubject<User | null>(1);
  currentKorisnik$ = this.currentKorisnikSource.asObservable();

  private currentShoppingCartSource = new ReplaySubject<ShowShoppingCart | null>(1);
  currentShoppingCart$ = this.currentShoppingCartSource.asObservable();


  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService,private jwtHelper: JwtHelperService, private loginService:LoginService) {
    this.checkToken();
    this.checkKorpa();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  private checkToken() {
    const token = this.cookieService.get('token');
    if (token) {
      const decodedToken = this.getDecodedAccessToken(token);
      if (decodedToken) {
        const username = Object.values(decodedToken)[0] as string;
        if (username) {
          this.loadCurrentKorisnik(token, username).subscribe();
        } else {
          // Invalid token format, clear the cookie and reset the current user
          this.cookieService.delete('token');
          this.currentKorisnikSource.next(null);
        }
      } else {
        // Invalid token, clear the cookie and reset the current user
        this.cookieService.delete('token');
        this.currentKorisnikSource.next(null);
      }
    } else {
      this.currentKorisnikSource.next(null);
    }
  }
  private checkKorpa(){
    const korpaId = Number(this.cookieService.get('korpaId'));
    if(korpaId){
      this.loadCurrentKorpa(korpaId).subscribe();
    }
  }


  loadCurrentKorisnik(token: string, username: string): Observable<User | null> {
    // Assuming you have a backend endpoint to retrieve the user by username
    return this.http.get<User>(this.baseUri + '/Korisnik/username/' + username).pipe(
      tap((korisnik: User) => {
        this.cookieService.set('token', token, { expires: 1 }); // Set token as a cookie with 1-day expiration
        localStorage.setItem('korisnik_id', korisnik.korisnikId.toString());
        this.currentKorisnikSource.next(korisnik);
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        this.cookieService.delete('token'); // Remove the token cookie
        localStorage.removeItem('korisnik_id');
        this.currentKorisnikSource.next(null);
        return of(null);
      })
    );
  }


  loadCurrentKorpa(korpaId: number): Observable<ShowShoppingCart | null> {
    return this.http.get<ShowShoppingCart>(this.baseUri + '/Korpa/' + korpaId).pipe(
      tap((korpa: ShowShoppingCart) => {
        this.cookieService.set('korpaId', korpaId.toString(), { expires: 1 });
        localStorage.setItem('korpaId', korpa.korpaId.toString());
        this.currentShoppingCartSource.next(korpa);
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        this.cookieService.delete('korpaId'); // Remove the korpaId cookie
        localStorage.removeItem('korpaId');
        this.currentShoppingCartSource.next(null);
        return of(null);
      })
    );
  }

}
