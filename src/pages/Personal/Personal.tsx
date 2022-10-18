import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateCollectionModal from "../../components/Collection/СreateCollectionModal";
import api from "../../utils/api";

import CollectionCard from "../../components/CollectionCard/CollectionCard";
import HomeSearch from "../../components/Home/HomeSearch";
import { useSelector } from "react-redux";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";

type CollectionListType = {
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  item_count: number;
  topic_name: string;
}[];

function Personal() {
  const searchData = useSelector((state: any) => state.search);

  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);

  const [collectionList, setCollectionList] = useState<CollectionListType | []>(
    []
  );
  const [collectionListLoading, setCollectionListLoading] =
    useState<boolean>(false);
  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  const getCollectionListApi = () => {
    setCollectionListLoading(true);
    api
      .get("collection/list/by-user")
      .then((res) => {
        setCollectionList(
          res.data.map((item: any, index: any) => ({
            collection_name: item.collection_name,
            user_name: item.user_id.user_name,
            id: item._id,
            path: item.path,
            item_count: item.item_count,
            topic_name: item.topic_id.topic_name,
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionListLoading(false);
      });
  };

  useEffect(() => {
    getCollectionListApi();
  }, []);

  if (searchData.collection.length > 0 && searchData.url === "/personal") {
    return <HomeSearch />;
  }

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Collection
        </Button>
      </Box>
      <Grid container spacing={3}>
        {!collectionListLoading
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
    </Box>
  );
}

export default Personal;
