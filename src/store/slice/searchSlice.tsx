import { createSlice } from "@reduxjs/toolkit";
import { CollectionListType, ItemListType } from "../../pages/Home/Home";

export type SearchSliceType = {
  item: ItemListType;
  collection: CollectionListType;
  comment: any[];
  url : "string";
};

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    item: [],
    collection: [],
    comment: [],
    url: [],
  },

  reducers: {
    setSerachItemList: (state, { payload }) => {
      state.item = payload;
    },
    setSerachCollectionList: (state, { payload }) => {
      state.collection = payload;
    },
    setSerachCommentList: (state, { payload }) => {
      state.comment = payload;
    },
    setSearchUrl: (state, { payload }) => {
      state.url = payload
    },
  },

});

// each case under reducers becomes an action

export const {
  setSerachItemList,
  setSerachCommentList,
  setSerachCollectionList,
  setSearchUrl,
} = searchSlice.actions;
export default searchSlice.reducer;
