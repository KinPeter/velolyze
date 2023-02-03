import { LocalStore, Store } from './store'
import { combineLatest, Observable, take } from 'rxjs'

interface State {
  text: string
  list: string[]
  flag: boolean
}

class ObjectStore extends Store<State> {
  constructor(initialState: State) {
    super(initialState)
  }

  public get stateObj() {
    return this.state
  }
  public text$ = this.select(state => state.text)
  public list$ = this.select(state => state.list)
  public flag$ = this.select(state => state.flag)

  public setText(text: string) {
    this.setState({ text })
  }
  public setList(list: string[]) {
    this.setState({ list })
  }
  public setFlag(flag: boolean) {
    this.setState({ flag })
  }
  public addToList(items: string[]) {
    this.setState({ list: [...this.state.list, ...items] })
  }
}

class ArrayStore extends Store<number[]> {
  constructor(initialState: number[]) {
    super(initialState)
  }

  public get stateValue() {
    return this.state
  }

  public stateObs = this.select(state => state)

  public setArray(array: number[]) {
    this.setState([...array])
  }

  public addToArray(items: number | number[]) {
    this.setState(Array.isArray(items) ? [...this.state, ...items] : [...this.state, items])
  }
}

class TestLocalStore extends LocalStore<State> {
  constructor(storageKey: string, initialState: State) {
    super(storageKey, initialState)
  }

  public get stateObj() {
    return this.state
  }
  public text$ = this.select(state => state.text)
  public list$ = this.select(state => state.list)
  public flag$ = this.select(state => state.flag)

  public setText(text: string) {
    this.setState({ text })
  }
  public setFlag(flag: boolean) {
    this.setState({ flag })
  }
}

describe('Store', () => {
  it('should handle object state properly', () => {
    const store = new ObjectStore({ text: '', list: [], flag: false })

    expect(Object.entries(store.stateObj)).toHaveSize(3)

    expect(store.flag$).toBeInstanceOf(Observable)
    store.flag$.pipe(take(1)).subscribe(flag => {
      expect(flag).toBeFalse()
    })
    store.setFlag(true)
    store.flag$.pipe(take(1)).subscribe(flag => {
      expect(flag).toBeTrue()
    })
    expect(store.stateObj.flag).toBeTrue()
    store.setText('a string')
    store.setList(['one', 'two', 'three'])
    combineLatest([store.text$, store.list$, store.flag$])
      .pipe(take(1))
      .subscribe(([text, list, flag]) => {
        expect(text).toEqual('a string')
        expect(list).toBeInstanceOf(Array)
        expect(list).toHaveSize(3)
        expect(list[2]).toEqual('three')
        expect(flag).toBeTrue()
      })

    store.addToList(['four', 'five'])
    store.list$.pipe(take(1)).subscribe(list => {
      expect(list).toHaveSize(5)
      expect(list[4]).toEqual('five')
    })
    store.setList([])
    expect(store.stateObj.list).toBeInstanceOf(Array)
    expect(store.stateObj.list).toHaveSize(0)
    expect(store.stateObj.text).toEqual('a string')
    expect(store.stateObj.flag).toBeTrue()
  })

  it('should handle array state properly', () => {
    const store = new ArrayStore([123])

    expect(store.stateValue).toBeInstanceOf(Array)
    expect(store.stateValue).toHaveSize(1)
    expect(store.stateValue[0]).toEqual(123)
    store.stateObs.pipe(take(1)).subscribe(arr => {
      expect(arr[0]).toEqual(123)
    })

    store.setArray([1, 2, 3])
    expect(store.stateValue).toBeInstanceOf(Array)
    expect(store.stateValue).toHaveSize(3)
    expect(store.stateValue[0]).toEqual(1)
    store.stateObs.pipe(take(1)).subscribe(arr => {
      expect(arr[2]).toEqual(3)
    })

    store.addToArray([4, 5])
    expect(store.stateValue[0]).toEqual(1)
    store.stateObs.pipe(take(1)).subscribe(arr => {
      expect(arr[4]).toEqual(5)
      expect(arr).toHaveSize(5)
    })

    store.addToArray(6)
    store.stateObs.pipe(take(1)).subscribe(arr => {
      expect(arr[5]).toEqual(6)
      expect(arr).toHaveSize(6)
    })

    store.setArray([])
    expect(store.stateValue).toBeInstanceOf(Array)
    expect(store.stateValue).toHaveSize(0)
    store.stateObs.pipe(take(1)).subscribe(arr => {
      expect(arr).toHaveSize(0)
    })
  })
})

describe('LocalStore', () => {
  it('should handle state from local storage', () => {
    const store = new TestLocalStore('test-store', { text: 'initial', flag: false, list: ['asd'] })

    let json = localStorage.getItem('test-store')
    expect(json).not.toBeNull()
    let stored = JSON.parse(json as string) as State
    expect(stored.text).toEqual('initial')
    expect(stored.list).toHaveSize(1)
    expect(stored.flag).toBeFalse()
    expect(Object.entries(store.stateObj)).toHaveSize(3)

    const otherStore = new TestLocalStore('test-store', {} as State)

    otherStore.flag$.pipe(take(1)).subscribe(flag => {
      expect(flag).toBeFalse()
    })
    otherStore.text$.pipe(take(1)).subscribe(text => {
      expect(text).toEqual('initial')
    })
    otherStore.list$.pipe(take(1)).subscribe(list => {
      expect(list.length).toEqual(1)
      expect(list[0]).toEqual('asd')
    })

    store.setFlag(true)
    store.setText('new text')

    json = localStorage.getItem('test-store')
    stored = JSON.parse(json as string) as State
    expect(stored.flag).toBeTrue()
    expect(stored.text).toEqual('new text')
  })
})
