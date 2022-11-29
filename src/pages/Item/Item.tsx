import { Box, Button, Pagination, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateItemModal from "./components/CreateItemModal";
import ItemCard from "../../components/ItemCard/ItemCard";
import HomeSearch from "../../components/Search/Search";
import { useSelector } from "react-redux";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useGetitemList } from "../../hooks/useGetItemData";
import { usePagination } from "./hooks/usePagination";
import { useModal } from "../../hooks/useModal";

function Item() {
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    visilble: createItemModalVisible,
    setVisible: setCreateItemModalVisible,
    handleModalVisible: handleOpenModal,
  } = useModal();

  const { pagenation, setPagenation, handlePaginationOnChange } =
    usePagination();
  const {
    data: itemList,
    isLoading: itemListLoading,
    refetchData: refetchItemList,
  } = useGetitemList(pagenation, setPagenation);

  if (searchData.item.length > 0 && searchData.url === "/item") {
    return <HomeSearch />;
  }

  return (
    <Box className="mb-12">
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
          ? itemList?.map((item, index) => (
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
      <Box className="flex justify-end mt-10">
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
          getItemListApi={refetchItemList}
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default Item;
