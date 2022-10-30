import { ItemType } from "./item.types";
import { Topic } from "./topic.types";
import { UserType } from "./user.types";

export type CollectionList = CollectionType[];

export interface CollectionType {
  _id: string;
  collection_name: string;
  description: string;
  mark_down: boolean;
  topic_id: Topic;
  user_id: UserType;
  item_count?: number;
  path: string;
  created_at: Date;
  updated_at: Date;
}

export type CollectionForm = {
  collection_name: string;
  description: string;
  topic_id: Topic;
  img: {
    dataUrl: string;
    file: any[];
  }[];
  file?: any;
  mark_down: boolean;
};

export type CollectionCardProp = {
  data: CollectionType;
};

export type CollectionItemCardProp = {
  data: ItemType;
};

export type CreateCollectionModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  getCollectionListApi: (a: number, b: number) => void;
};

export type EditCollectionModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  collection: CollectionType;
  getCollectionByIdApi: () => void;
};

export type UploadImageProp = {
  setImages: any;
  images: any;
  onChange: any;
  errors: any;
};

export type ImageType = {
  dataURL: string;
  file: {};
}[];

export type ItemExtraFieldForm = {
  selectedField?: string;
  int_field: { name: string }[];
  str_field: { name: string }[];
  textare_field: { name: string }[];
  checkbox_field: { name: string }[];
  date_field: { name: string }[];
  collection_id?: string;
};

export type CreateItemExtraFieldModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  collection: CollectionType;
};

export type ItemFieldCount = {
  integer: string;
  string: string;
  textare: string;
  date: string;
  checkbox: string;
};

export type SpecifyFieldCountForm = {
  count: string;
};

export type SpecifyFieldCountModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  propertyName: string;
  itemFieldCount: ItemFieldCount;
  setItemFieldCount: (value: ItemFieldCount) => void;
};
