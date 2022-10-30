import { createSlice } from "@reduxjs/toolkit";
import { CollectionList } from "../../types/collection.types";
import { CommentList } from "../../types/comment.types";
import { ItemList } from "../../types/item.types";

export type SearchSliceType = {
  item: ItemList;
  collection: CollectionList;
  comment: CommentList;
  url: "string";
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
      state.url = payload;
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
