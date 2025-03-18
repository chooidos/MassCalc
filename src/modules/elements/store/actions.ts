import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchElements } from '../async-layer';
import { elementsSlise } from './slice';
import { ElementCh } from '../types/elements';

export const { updateSelectedElement, updateCountSelectedElement, deb } =
  elementsSlise.actions;

export const getElements = createAsyncThunk<ElementCh[]>(
  'elements/getElements',
  fetchElements,
);
