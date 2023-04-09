import Dexie from 'dexie'
import type { Table } from 'dexie'

import type { UserData } from './user-data'

/** 台本インデックスのレコード */
export interface ScriptIndex {
  id?: number
  sortKey: number
  name: string
  scriptId: number
}

/** 台本データのレコード */
export interface ScriptData {
  id?: number
  pscJson: string
  srcType: string
  url: string
  userData: UserData
}

/** スキーマの定義 */
class PscvDB extends Dexie {
  scriptIndex!: Table<ScriptIndex>
  scriptData!: Table<ScriptData>

  constructor() {
    super('pscvDB')

    this.version(1).stores({
      scriptIndex: '++id, sortKey, &scriptId',
      scriptData: '++id',
    })
  }

  /** 台本データを DB に追加する */
  public async addScript(
    name: string, pscJson: string, srcType: string, url: string
  ): Promise<number> {
    return this.transaction('rw', this.scriptIndex, this.scriptData, async () => {
      // 台本データ追加
      const scriptId = await this.scriptData.add({
        pscJson, srcType, url, userData: {}
      }) as number

      // 台本インデックス更新
      let newSortKey = 2
      await this.scriptIndex.orderBy('sortKey').modify(scIndex => {
        scIndex.sortKey = newSortKey++
      })
      this.scriptIndex.add({ sortKey: 1, name, scriptId })

      // 新規 ID を返す
      return scriptId
    })
  }

  /** 台本データを DB から削除する */
  public async deleteScript(scriptId: number): Promise<void> {
    return this.transaction('rw', this.scriptIndex, this.scriptData, async () => {
      // 台本データ削除
      await this.scriptData.delete(scriptId)
      // 台本インデックス削除
      const scIndex = await this.scriptIndex.get({ scriptId })
      await this.scriptIndex.delete(scIndex.id)
    })
  }

  /** 台本インデックスを並べ替える */
  public async sortByScriptIds(scriptIds: number[]): Promise<void> {
    return this.transaction('rw', this.scriptIndex, async () => {
      scriptIds.forEach((scriptId, index) => {
        this.scriptIndex.get({scriptId}).then(record => {
          this.scriptIndex.update(record.id, {sortKey: index + 1})
        })
      })
    })
  }
}

export const db = new PscvDB()

/** 台本データからタイトルを取得する */
export function getScTitle(scData: ScriptData): string {
  const scObj = JSON.parse(scData.pscJson)
  return scObj.title ?? ''
}
