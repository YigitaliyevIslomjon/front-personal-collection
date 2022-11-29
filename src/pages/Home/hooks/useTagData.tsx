import { toastifyMessage } from "../../../components/ToastifyNotification/ToastifyNotification";
import {
  setSearchUrl,
  setSerachItemList,
} from "../../../store/slice/searchSlice";
import { useDispatch } from "react-redux";
import api from "../../../utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tag, TagColudList } from "../../../types/item.types";

export const useGetSearchTag = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: getSearchTag,
  });

  function getSearchTag(id: string): Promise<void> {
    return api
      .post(`search/${id}`)
      .then((res) => {
        if (res.data.length === 0) {
          toastifyMessage({
            type: "warn",
            message: "No matching information found",
          });
        } else {
          toastifyMessage({
            type: "success",
            message: "Matching data found",
          });
        }
        dispatch(setSearchUrl("/"));
        dispatch(setSerachItemList(res.data));
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  }
};

function getTagListApi(): Promise<TagColudList> {
  return api.get(`/tag/list`).then((res) =>
    res.data.map((item: Tag, index: number) => ({
      value: item.tag_name,
      id: item._id,
      count: 5 * (index + 1),
    }))
  );
}

export const useGetTagList = () =>
  useQuery({
    queryKey: ["tags"],
    queryFn: getTagListApi,
    initialData: [],
  });
