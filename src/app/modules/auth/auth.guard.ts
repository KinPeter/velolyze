import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  UrlTree,
  CanMatch,
  UrlSegment,
  Route,
} from '@angular/router'
import { Injectable } from '@angular/core'
import { FirebaseAuthService } from '../../firebase/firebase-auth.service'
import { filter, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class AuthGuard implements CanActivate, CanMatch {
  constructor(private router: Router, private auth: FirebaseAuthService) {}

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.guardFn()
  }

  public canMatch(
    _route: Route,
    _segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guardFn()
  }

  private guardFn(): Observable<boolean | UrlTree> {
    return this.auth.isLoggedIn$.pipe(
      filter(value => value !== undefined),
      map(value => {
        return value === true ? true : this.router.createUrlTree(['/login'])
      })
    )
  }
}
