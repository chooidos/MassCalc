export interface ElementCh {
  name?: string,
  symbol?: string,
  weight?: number,
}

export interface SelectedElement extends ElementCh {
  idx: number,
  number?: number,
}