import { createSlice, current } from '@reduxjs/toolkit';

import { getElements } from './actions';
import { ElementCh, SelectedElement } from '../types/elements';

export type ElementsState = {
  list: ElementCh[];
  selected: SelectedElement[];
  sampleWeight?: string;
  results?: {
    element: string;
    mass: number;
  }[];
  error?: string | undefined;
};

const initialState: ElementsState = {
  list: [],
  selected: [
    { idx: 1, symbol: '', atomic_mass: '', number: '' },
    { idx: 2, symbol: '', atomic_mass: '', number: '' },
    { idx: 3, symbol: '', atomic_mass: '', number: '' },
    { idx: 4, symbol: '', atomic_mass: '', number: '' },
    { idx: 5, symbol: '', atomic_mass: '', number: '' },
    { idx: 6, symbol: '', atomic_mass: '', number: '' },
  ],
  sampleWeight: '',
};

export const elementsSlice = createSlice({
  name: 'elementsSlice',
  initialState: initialState,
  reducers: {
    updateSelectedElement: (state, action) => {
      const index = state.selected.findIndex(
        (el) => el.idx === action.payload.idx,
      );

      if (index !== -1) {
        state.selected[index] = action.payload;
      } else {
        state.selected.push(action.payload);
      }
    },
    updateSampleWeight: (state, action) => {
      state.sampleWeight = action.payload;
    },
    deb: (state) => {
      console.log(current(state));
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    updateError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getElements.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default elementsSlice.reducer;
