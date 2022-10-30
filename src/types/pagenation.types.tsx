export interface PagenationType {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
}

export type UserPagenation = {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
  total_user_count: number;
};
export type ItemPagenation = {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
  total_item_count: number;
};
