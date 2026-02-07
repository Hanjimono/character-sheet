/** Interface for a line of character information */
export interface CharacterInfoLine {
  /** Title of the line */
  title: string
  /** Value of the line */
  value: string
}

/** Interface for character icons */
export interface CharacterIconsAndLinks {
  /** Link for the beyond */
  beyondLink?: string
  /** Link for the campaign */
  campaignLink?: string
  /** Icon for the avatar */
  avatarIcon?: string
  /** Icon for the beyond link */
  beyondIcon?: string
  /** Icon for the campaign link */
  campaignIcon?: string
  /** Icon for the inventory link */
  inventoryIcon?: string
  /** Icon for the appearance link */
  appearanceIcon?: string
  /** Icon for the notes link */
  notesIcon?: string
  /** Icon for the spells link */
  spellsIcon?: string
}
