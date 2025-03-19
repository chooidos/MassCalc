import { createSlice, current } from '@reduxjs/toolkit';

import { getElements } from './actions';
import { ElementCh, SelectedElement } from '../types/elements';

export type ElementsState = {
  list: ElementCh[];
  selected: SelectedElement[];
  error?: string | undefined;
};

export const elementsSlice = createSlice({
  name: 'elementsSlice',
  initialState: {
    list: [],
    selected: [
      { idx: 1 },
      { idx: 2 },
      { idx: 3 },
      { idx: 4 },
      { idx: 5 },
      { idx: 6 },
    ],
  } as ElementsState,
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
    updateCountSelectedElement: (state, action) => {
      const index = state.selected.findIndex(
        (el) => el.idx === action.payload.idx,
      );

      if (index !== -1) {
        state.selected[index].number = action.payload.number;
      }
    },
    deb: (state) => {
      console.log(current(state));
    },
  },
  extraReducers(builder) {
    builder.addCase(getElements.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default elementsSlice.reducer;
