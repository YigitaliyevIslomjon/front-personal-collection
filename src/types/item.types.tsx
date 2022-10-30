import { CollectionType } from "./collection.types";
import { UserType } from "./user.types";

export type ItemList = ItemType[];

export interface ItemType {
  _id: string;
  item_name: string;
  tags: TagList;
  collection_id: CollectionType;
  user_id: UserType;
  path: string;
  int_field: any[];
  str_field: any[];
  textare_field: any[];
  checkbox_field: any[];
  date_field: any[];
  created_at: Date;
  updated_at: Date;
  __v: number;
}

export interface ItemPagenation {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
  total_item_count: number;
}

export type ItemCardProp = {
  data: ItemType;
};

export type TagColudList = {
  tag_name: string;
  id: string;
  count: number;
}[];

export type TagList = Tag[];
export type TagMapList = string[];

export type Tag = {
  tag_name: string;
  _id: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
};

export type ItemExtraFieldType = {
  int_field: { [key: string]: string }[];
  str_field: { [key: string]: string }[];
  textare_field: { [key: string]: string }[];
  checkbox_field: { [key: string]: boolean }[];
  date_field: { [key: string]: string }[];
};

export type CreateItemModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  getItemListApi: (a: number, b: number) => void;
};
export type EditItemModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  itemId: string | undefined;
  getItemDataByIdApi: (a: number, b: number) => void;
};

export type ItemForm = {
  collection_id: CollectionType;
  item_name: string;
  tags: string[];
  img: string;
  int_field: { [key: string]: string }[];
  str_field: { [key: string]: string }[];
  textare_field: { [key: string]: string }[];
  checkbox_field: { [key: string]: boolean }[];
  date_field: { [key: string]: string }[];
};

export type ItemCollectionCardProp = {
  data: CollectionType;
};

export type ItemListTable = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
  order: number;
}[];
