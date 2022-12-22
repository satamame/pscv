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
  constructor (
    public title: string,
    public author: string,
    public chars: string[],
    public lines: PScLine[],
  ) {}

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

  /** 目次項目 (登場人物見出しと柱の行) を抽出する */
  getTocItems(): { text: string, index: number }[] {
    const headers = this.lines.map((line, index) => {
      console.log(line.type)
      if (
        line.type === PSC_LINE_TYPE.CHARSHEADLINE ||
        line.type === PSC_LINE_TYPE.H1 ||
        line.type === PSC_LINE_TYPE.H2 ||
        line.type === PSC_LINE_TYPE.H3
      ) {
        return { text: line.text, index: index }
      }
    })
    const tocItems = headers.filter((line) => {
      return !!line
    })
    console.log({ tocItems })
    return tocItems
  }
}
