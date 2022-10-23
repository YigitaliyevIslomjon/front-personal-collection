import { useState, useEffect } from "react";
import { Box, Button, Pagination } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import api from "../../utils/api";
import CreateItemModal from "../../components/Item/CreateItemModal";
import ItemCard from "../../components/ItemCard/ItemCard";
import HomeSearch from "../../components/Home/HomeSearch";
import { useSelector } from "react-redux";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

type itemListType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
  created_at: string;
}[];

type PagenationType = {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
};

function Item() {
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);

  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 1,
    total_page_count: 1,
  } as PagenationType);
  const [itemList, setItemList] = useState<itemListType | []>([]);
  const [itemListLoading, setItemListLoading] = useState<boolean>(false);
  const handleOpenModal = () => {
    setCreateItemModalVisible(true);
  };

  const getItemListApi = (pageNumber: number, pageSize: number) => {
    setItemListLoading(true);
    api
      .get("item/list", { params: { pageNumber, pageSize } })
      .then((res) => {
        setPagenation(res.data.pagenation);
        setItemList(
          res.data.item.map((item: any) => ({
            item_name: item?.item_name,
            collection_name: item.collection_id?.collection_name,
            user_name: item.user_id?.user_name,
            id: item._id,
            path: item.path,
            tags: item.tags.map((item: any) => item?.tag_name),
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setItemListLoading(false);
      });
  };

  const handlePaginationOnChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagenation({ ...pagenation, pageNumber: +value });
    getItemListApi(value, 8);
  };

  useEffect(() => {
    getItemListApi(1, 8);
  }, []);

  if (searchData.item.length > 0 && searchData.url === "/item") {
    return <HomeSearch />;
  }

  return (
    <Box className="mb-4">
      <Box className="flex justify-end mb-5">
        {loginUser.role ? (
          <Button
            onClick={handleOpenModal}
            variant="contained"
            className="text-sm sm:text-base"
          >
            {t("createItem")}
          </Button>
        ) : null}
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} className="min-h-[400px]">
        {!itemListLoading
          ? itemList.map((item, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={item.id}>
                <ItemCard data={item} />
              </Grid>
            ))
          : Array(8)
              .fill(0)
              .map((item, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                  <CardSkeletion />
                </Grid>
              ))}
      </Grid>
      <Box className="mt-10 flex justify-end">
        <Pagination
          variant="outlined"
          shape="rounded"
          count={pagenation.total_page_count}
          page={pagenation.pageNumber}
          onChange={handlePaginationOnChange}
        />
      </Box>
      {createItemModalVisible ? (
        <CreateItemModal
          getItemListApi={getItemListApi}
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default Item;
