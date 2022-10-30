import { useState, useEffect } from "react";
import { Box, Button, Pagination } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateCollectionModal from "../../components/Collection/СreateCollectionModal";
import api from "../../utils/api";
import CollectionCard from "../../components/CollectionCard/CollectionCard";
import HomeSearch from "../../components/Home/HomeSearch";
import { useSelector } from "react-redux";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { CollectionList } from "../../types/collection.types";
import { PagenationType } from "../../types/pagenation.types";

function Personal() {
  const searchData = useSelector((state: any) => state.search);

  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);

  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 1,
    total_page_count: 1,
  } as PagenationType);

  const [collectionList, setCollectionList] = useState<CollectionList | []>([]);
  const [collectionListLoading, setCollectionListLoading] =
    useState<boolean>(false);
  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  const getCollectionListApi = (pageNumber: number, pageSize: number) => {
    setCollectionListLoading(true);
    api
      .get("collection/list/by-user", { params: { pageNumber, pageSize } })
      .then((res) => {
        setPagenation(res.data.pagenation);
        setCollectionList(res.data.collection);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionListLoading(false);
      });
  };

  const handlePaginationOnChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagenation({ ...pagenation, pageNumber: +value });
    getCollectionListApi(value, 8);
  };

  useEffect(() => {
    getCollectionListApi(1, 8);
  }, []);

  if (searchData.collection.length > 0 && searchData.url === "/personal") {
    return <HomeSearch />;
  }

  return (
    <Box className="mb-10">
      <Box className="flex justify-end mb-5">
        <Button
          onClick={handleOpenModal}
          variant="contained"
          className="text-sm sm:text-base"
        >
          Create Collection
        </Button>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} className="min-h-[400px]">
        {!collectionListLoading
          ? collectionList.map((item, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={item._id}>
                <CollectionCard data={item} />
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
      {createCollModalVisible ? (
        <CreateCollectionModal
          getCollectionListApi={getCollectionListApi}
          setVisible={setCreateCollModalVisible}
          visible={createCollModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default Personal;
