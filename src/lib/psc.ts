export const PSC_LINE_TYPE = {
  TITLE: 0,                  // Title
  AUTHOR: 1,                 // Author name
  CHARSHEADLINE: 2,          // Headline of character list
  CHARACTER: 3,              // Character
  H1: 4,                     // Headline of scene (level 1)
  H2: 5,                     // Headline of scene (level 2)
  H3: 6,                     // Headline of scene (level 3)
  DIRECTION: 7,              // Direction
  DIALOGUE: 8,               // Dialogue
  ENDMARK: 9,                // End mark
  COMMENT: 10,               // Comment
  EMPTY: 11,                 // Empty line
  CHARACTER_CONTINUED: 12,   // Following lines of Character
  DIRECTION_CONTINUED: 13,   // Following lines of Direction
  DIALOGUE_CONTINUED: 14,    // Following lines of Dialogue
  COMMENT_CONTINUED: 15,     // Following lines of Comment
} as const

export type PScLineType = typeof PSC_LINE_TYPE[keyof typeof PSC_LINE_TYPE]
export type Headline = { text: string, lineIndex: number }

/** Object of each line in PSc */
export class PScLine {
  constructor (
    public type: PScLineType,
    public name?: string,
    public text?: string,
  ) {}
}

/** Play Script object */
export class PSc {
  // headlines は見出し項目の情報 (テキストと行番号) の配列
  public readonly headlines: Headline[]
  constructor (
    public title: string,
    public author: string,
    public chars: string[],
    public lines: PScLine[],
  ) {
    this.headlines = this.makeHeadlines()
  }

  /** JSON 文字列から PSc オブジェクトを作って返す */
  static fromJson(json: string): PSc {
    try {
      const pscObj = JSON.parse(json)

      // lines の各要素を PScLine クラスのインスタンスにする
      const lines = pscObj.lines.map((line: PScLine) => {
        const type = PSC_LINE_TYPE[line.type]
        return new PScLine(type, line.name, line.text)
      })

      // PSc クラスのインスタンスを作って返す
      const psc = new PSc(
        pscObj.title, pscObj.author, pscObj.chars, lines
      )
      return psc
    } catch (error) {
      throw new Error('台本データが不正です。')
    }
  }

  /** URL からデータを取得して PSc オブジェクトを返す */
  static async fromUrl(url: string): Promise<PSc> {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      // fetch で取得したデータは { psc: PSc } または PSc の形を想定する
      const pscData: PSc = data.psc ? data.psc : data
      try {
        // lines の各要素を PScLine オブジェクトにする
        const lines = pscData.lines.map((line) => {
          const type = PSC_LINE_TYPE[line.type]
          return new PScLine(type, line.name, line.text)
        })

        // インスタンス化して返す
        const psc = new PSc(
          pscData.title, pscData.author, pscData.chars, lines
        )
        return psc
      } catch (error) {
        throw new Error('読み込めませんでした。')
      }
    } else {
      throw new Error('読み込めませんでした。')
    }
  }

  /** 見出し項目を作る */
  private makeHeadlines(): Headline[] {
    // 見出し行以外を undefined とした配列を得る
    const headlines = this.lines.map((line, index) => {
      if (
        line.type === PSC_LINE_TYPE.TITLE ||
        line.type === PSC_LINE_TYPE.CHARSHEADLINE ||
        line.type === PSC_LINE_TYPE.H1 ||
        line.type === PSC_LINE_TYPE.H2 ||
        line.type === PSC_LINE_TYPE.H3
      ) {
        return { text: line.text, lineIndex: index }
      }
    })
    // undefined を削除して返す
    return headlines.filter((line) => {
      return !!line
    })
  }

  /** 行番号からその行が属している見出しの番号を返す */
  public headlineForLine(index: number): number {
    let min = 0
    let max = this.headlines.length - 1
    // 最後の見出し以降なら最後の見出し番号を返す
    if (this.headlines[max].lineIndex <= index) {
      return max
    }
    // バイナリサーチ
    let mid: number
    while (true) {
      mid = Math.floor((min + max) / 2)
      if (mid == min) {
        break
      }
      const midIndex = this.headlines[mid].lineIndex
      const nextIndex = this.headlines[mid + 1].lineIndex
      if (midIndex <= index) {
        min = mid
      } else if (nextIndex > index) {
        max = mid
      }
    }
    return mid
  }
}
