import { RootState } from "../../../store";

export const selectElements = (state: RootState) => state.elements.list;
export const selectSelectedElements = (state: RootState) => state.elements.selected;