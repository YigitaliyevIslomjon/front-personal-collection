import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { CollectionList } from "../../../types/collection.types";

const getLargetCollectionListApi = (): Promise<CollectionList> => {
  return api.get("collection/large").then((res) => res.data);
};

export const useGetLargCollectionList = () => {
  return useQuery(["largeCollections"], getLargetCollectionListApi);
};
