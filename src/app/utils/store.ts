import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'

export class Store<T> {
  private state$: BehaviorSubject<T>

  protected get state(): T {
    return this.state$.getValue()
  }

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState)
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    )
  }

  protected setState(newState: Partial<T>): void {
    if (Array.isArray(newState) && Array.isArray(this.state)) {
      this.state$.next([...newState] as unknown as T)
    } else if (newState instanceof Object) {
      this.state$.next({
        ...this.state,
        ...newState,
      })
    } else {
      this.state$.next(newState)
    }
  }
}

export class LocalStore<T> extends Store<T> {
  constructor(private storeKey: string, initialState: T) {
    super(initialState)
    if (!localStorage) return
    if (localStorage.getItem(storeKey) === null) {
      localStorage.setItem(storeKey, this.toString(initialState))
    } else {
      super.setState(JSON.parse(localStorage.getItem(storeKey) || '""'))
    }
  }

  protected override setState(newState: Partial<T>): void {
    super.setState(newState)
    localStorage.setItem(this.storeKey, this.toString(super.state))
  }

  private override toString(value: T): string {
    return JSON.stringify(value, null, 2)
  }
}
