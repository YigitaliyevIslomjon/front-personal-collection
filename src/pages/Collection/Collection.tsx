import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateCollectionModal from "../../components/Collection/СreateCollectionModal";
import api from "../../utils/api";

import CollectionCard from "../../components/CollectionCard/CollectionCard";
import HomeSearch from "../../components/Home/HomeSearch";
import { useSelector } from "react-redux";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { ToastContainer } from "react-toastify";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { useTranslation } from "react-i18next";

type CollectionListType = {
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  item_count: number;
  topic_name: string;
}[];

function Collection() {
  let { t } = useTranslation();

  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const searchData = useSelector((state: any) => state.search);

  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<CollectionListType | []>(
    []
  );

  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  const getCollectionListApi = () => {
    api
      .get("collection/list")
      .then((res) => {
        setCollectionList(
          res.data.map((item: any, index: any) => ({
            collection_name: item.collection_name,
            user_name: item.user_id?.user_name,
            id: item._id,
            path: item.path,
            item_count: item.item_count,
            topic_name: item.topic_id?.topic_name,
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  useEffect(() => {
    getCollectionListApi();
  }, []);

  if (searchData.collection.length > 0 && searchData.url === "/collection") {
    return <HomeSearch />;
  }

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        {loginUser.role ? (
          <Button onClick={handleOpenModal} variant="contained">
            {t("createCollcetion")}
          </Button>
        ) : null}
      </Box>
      <Grid container spacing={3}>
        {collectionList.length > 0
          ? collectionList.map((item, index) => (
              <Grid xs={3} key={item.id}>
                <CollectionCard data={item} />
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
      {createCollModalVisible ? (
        <CreateCollectionModal
          setVisible={setCreateCollModalVisible}
          visible={createCollModalVisible}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default Collection;
