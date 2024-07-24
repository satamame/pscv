/**
 * グローバル変数を管理するオブジェクト
 */
class Global {
  // アプリを更新するための関数を保持するプロパティ
  appUpdateFunc: Function | undefined = $state()
}

export const g = new Global()
