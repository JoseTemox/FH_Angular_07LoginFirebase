import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyA2nSx2yPXpg7_0G777DUlAo69hRNC-lfk';

  userToken: string;

  // crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
 // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');

  }

  login( usuario: UsuarioModel) {
    const authData = {
    ...usuario,
    returnSecureToken: true
  };

    return this.http.post(
    `${ this.url}signInWithPassword?key=${ this.apikey }`,
    authData
  ).pipe(
    map( resp => {
      // console.log('Entro en el rxjs');
      this.guardarToken( resp['idToken']);
      return resp;
    })
  );

  }

  nuevoUsuario( usuario: UsuarioModel ) {

    const authData = {
      ...usuario, // esta es otra forma de hacer ya que los datos son iguales las 2 lineas siguientes tambien se pueden ejecutar
      // email: usuario.email,
      // password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url}signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        // console.log('Entro en el rxjs');
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }

  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );
    localStorage.setItem('expire', hoy.getTime().toString() );


  }

  leerToken() {
    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {

    if (this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
    
  }




}
