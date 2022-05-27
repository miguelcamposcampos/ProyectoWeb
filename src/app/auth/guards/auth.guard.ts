import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators'; 
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { AuthService } from '../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad  {

constructor(
  private authService: AuthService,
  private router : Router, 
  private swal : MensajesSwalService,
){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
  return  this.authService.verificarAutenticacion()
    .pipe(
      tap( estadoAutenticado => { 
        if(!estadoAutenticado){ 
          console.log('bloqueado por CANACTIVE'); 
          this.router.navigate(['/acceso-denegado']);
        } 
      })
    );
}

canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
  return  this.authService.verificarAutenticacion()
  .pipe(
    tap( estadoAutenticado => { 
      if(!estadoAutenticado){ 
        console.log('bloqueado por canActivateChild'); 
         this.router.navigate(['/acceso-denegado']); 
      }
    })
  );
} 

 
canLoad(
  route: Route,
  segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
    return this.authService.verificarAutenticacion()
      .pipe(
        tap( estadoAutenticado => {
          if(!estadoAutenticado){
            console.log('bloqueado por CANLOAD'); 
            this.router.navigate(['/acceso-denegado']);
          } 
        })
      ); 
  }
}
