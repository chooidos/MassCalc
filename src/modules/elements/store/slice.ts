import { createSlice, current } from "@reduxjs/toolkit";

import { getElements } from "./actions";
import { ElementCh, SelectedElement } from "../types/elements";

export type ElementsState = {
  list: ElementCh[];
  selected: SelectedElement[];
  error: string | undefined;
}

export const elementsSlise = createSlice({
  name: 'elementsSlice',
  initialState: {} as ElementsState,
  reducers: {
    updateSelectedElement: (state, action) => {
      if (state.selected?.length) {
        const index = state.selected.findIndex(el => el.idx === action.payload.idx);

        if (index !== -1) {
          state.selected[index] = action.payload;
        } else {
          state.selected.push(action.payload);
        }
      } else {
        state.selected = [action.payload];
      }
    },
    updateCountSelectedElement: (state, action) => {
      if (state.selected?.length) {
        const index = state.selected.findIndex(el => el.idx === action.payload.idx);

        if (index !== -1) {
          state.selected[index].number = action.payload.number;
        }
      }
    },
    deb: (state) => {
      console.log(current(state));
    }
  },
  extraReducers(builder) {
    builder
      .addCase(
        getElements.fulfilled,
        (state, action) => {
          state.list = action.payload;
        }
      )
  },
})

export const { selectElement } = elementsSlise.actions;
export default elementsSlise.reducer;