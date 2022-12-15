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
  COMMENT_CONTINUED: 15,     // Foloowing lines of Comment
} as const

export type PScLineType = typeof PSC_LINE_TYPE[keyof typeof PSC_LINE_TYPE]

/** Object of each line in PSc */
export class PScLine {
  constructor (
    public type: PScLineType,
    public name: string,
    public text: string,
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

  static fromJson(json: string): PSc {
    const data = JSON.parse(json);
    const psc = new PSc(data.title, data.author, data.chars, data.lines);
    return psc;
  }

  static async fromUrl(url: string): Promise<PSc | void> {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      try {
        const psc = new PSc(
          data.psc.title, data.psc.author, data.psc.chars, data.psc.lines
        )
        return psc
      } catch (error) {
        throw new Error('読み込めませんでした。')
      }
    } else {
      throw new Error('読み込めませんでした。')
    }
  }
}
