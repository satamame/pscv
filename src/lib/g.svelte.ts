/**
 * グローバル変数を管理するオブジェクト
 */
class Global {
  // アプリを更新するための関数を保持するプロパティ
  appUpdateFunc: Function | undefined = $state()
  // 状態を保持するオブジェクト
  state = new State()
}

/**
 * ローカルストレージに状態を保持するオブジェクト
 */
class State {
  // 現在開いている台本の ID
  private _activeScriptId: number = 0
  // 各台本のスクロール位置 (行)
  scroll: Object = {}

  constructor() {
    this.load()
  }

  public load() {
    const activeScriptId = localStorage.getItem('activeScriptId') ?? '0'
    this._activeScriptId = parseInt(activeScriptId)

    const scroll = localStorage.getItem('scroll') ?? '{}'
    this.scroll = JSON.parse(scroll)
  }

  get activeScriptId(): number {
    return this._activeScriptId
  }
  set activeScriptId(scriptId: number) {
    this._activeScriptId = scriptId
    localStorage.setItem('activeScriptId', scriptId.toString())
  }
}

export const g = new Global()
