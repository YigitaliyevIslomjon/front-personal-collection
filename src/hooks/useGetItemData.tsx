import { ItemList } from "../types/item.types";
import api from "../utils/api";
import { useQuery } from "@tanstack/react-query";
import { PagenationType } from "../types/pagenation.types";

export const useGetitemList = (
  pagenation: PagenationType,
  setPagenation: (value: PagenationType) => void
) => {
  const { data, isLoading, error } = useQuery(
    ["itemList", pagenation.pageNumber, pagenation.pageSize],
    () => getItemList(pagenation.pageNumber, pagenation.pageSize),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  return {
    data,
    isLoading,
    refetchData,
    error,
  };
  function refetchData() {
    setPagenation({ pageNumber: 1, pageSize: 2, total_page_count: 1 });
  }
  function getItemList(
    pageNumber: number,
    pageSize: number
  ): Promise<ItemList> {
    return api
      .get("item/list", { params: { pageNumber, pageSize } })
      .then((res) => {
        setPagenation(res.data.pagenation);
        return res.data.item;
      });
  }
};
