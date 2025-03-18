import { invoke } from '@tauri-apps/api/core';

import { ElementCh } from '../types/elements';

export const fetchElements = async () => {
  const elements = await invoke<ElementCh[]>('get_elements');
  return elements;
};
