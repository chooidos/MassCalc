export interface ElementCh {
  name?: string;
  symbol?: string;
  atomic_mass?: number;
}

export interface SelectedElement extends ElementCh {
  idx: number;
  number?: number;
}
