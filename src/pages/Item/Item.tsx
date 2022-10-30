import { useState, useEffect } from "react";
import { Box, Button, Pagination, Typography } from "@mui/material";
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
import { ItemList } from "../../types/item.types";
import { PagenationType } from "../../types/pagenation.types";

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

  const [itemList, setItemList] = useState<ItemList | []>([]);

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
        setItemList(res.data.item);
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
      <Box className="flex justify-between mb-5">
        <Typography variant="h6" className="text-base sm:text-xl">
          {t("allItems")}
        </Typography>
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
              <Grid xs={12} sm={6} md={4} lg={3} key={item._id}>
                <ItemCard data={item} key={item._id} />
              </Grid>
            ))
          : Array(8)
              .fill(0)
              .map((item, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                  <CardSkeletion key={index} />
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
