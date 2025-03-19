import { RootState } from '../../../store';

export const selectElements = (state: RootState) => state.elements.list;
export const selectSelectedElements = (state: RootState) =>
  state.elements.selected;
export const selectSampleWeight = (state: RootState) =>
  state.elements.sampleWeight;
