import { ItemType } from "./item.types";
import { UserType } from "./user.types";

export type CommentList = Comment[];

export interface Comment {
  text: string;
  item_id: ItemType;
  user_id: UserType;
  created_at: Date;
  updated_at: Date;
  _id: string;
  __v: number;
}

export type CommentForm = {
  text: string;
  item_id?: string;
};

export type CommentTextProp = {
  data: Comment;
};
