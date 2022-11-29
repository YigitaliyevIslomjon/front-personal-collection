import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { ItemList } from "../../../types/item.types";
import { PagenationType } from "../../../types/pagenation.types";
import { useState } from "react";

const getItemList = (
  pageNumber: number,
  pageSize: number
): Promise<ItemList> => {
  return api
    .get("item/list", { params: { pageNumber, pageSize } })
    .then((res) => res.data.item);
};

export const useGetitemList = () => {
  const [pagenation, ] = useState<PagenationType>({
    pageNumber: 1,
    pageSize: 5,
    total_page_count: 1,
  });

  return useQuery(
    ["itemList", pagenation.pageNumber, pagenation.pageSize],
    () => getItemList(pagenation.pageNumber, pagenation.pageSize),
    // {
    //   keepPreviousData: true,
    //   staleTime: 5000,
    // }
  );
};
