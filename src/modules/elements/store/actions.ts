import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchElements } from "../async-layer";
import { ElementCh } from "../types/elements";

export const getElements = createAsyncThunk<ElementCh[]>('elements/getElements', fetchElements);