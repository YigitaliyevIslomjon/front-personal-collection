import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
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
}[];

function Item() {
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);
  const [itemList, setItemList] = useState<itemListType | []>([]);

  const handleOpenModal = () => {
    setCreateItemModalVisible(true);
  };

  const getItemListApi = (pageSize: number, pageNumber: number) => {
    api
      .get("item/list", { params: { pageNumber, pageSize } })
      .then((res) => {
        setItemList(
          res.data.map((item: any) => ({
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
      });
  };

  useEffect(() => {
    getItemListApi(10, 1);
  }, []);

  if (searchData.item.length > 0 && searchData.url === "/item") {
    return <HomeSearch />;
  }

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        {loginUser.role ? (
          <Button onClick={handleOpenModal} variant="contained">
            {t("createItem")}
          </Button>
        ) : null}
      </Box>
      <Grid container spacing={3}>
        {itemList.length > 0
          ? itemList.map((item, index) => (
              <Grid xs={3} key={item.id}>
                <ItemCard data={item} />
              </Grid>
            ))
          : Array(8)
              .fill(0)
              .map((item, index) => (
                <Grid xs={3} key={index}>
                  <CardSkeletion />
                </Grid>
              ))}
      </Grid>
      {createItemModalVisible ? (
        <CreateItemModal
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default Item;
