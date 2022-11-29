import { useState } from "react";
import { PagenationType } from "../../../types/pagenation.types";

export const usePagination = () => {
  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 2,
    total_page_count: 1,
  } as PagenationType);

  const handlePaginationOnChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagenation({ ...pagenation, pageNumber: +value });
  };

  return { pagenation, setPagenation, handlePaginationOnChange };
};
