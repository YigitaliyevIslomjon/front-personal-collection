import { useState, useEffect } from "react";
import { Box, Button, Pagination, Typography } from "@mui/material";
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
import DownloadIcon from "@mui/icons-material/Download";
import { CSVLink } from "react-csv";
import { CollectionList } from "../../types/collection.types";
import { PagenationType } from "../../types/pagenation.types";

function Collection() {
  let { t } = useTranslation();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const searchData = useSelector((state: any) => state.search);
  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 1,
    total_page_count: 1,
  } as PagenationType);

  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<CollectionList | []>([]);
  const [collectionListLoading, setCollectionListLoading] =
    useState<boolean>(false);
  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  const getCollectionListApi = (pageNumber: number, pageSize: number) => {
    setCollectionListLoading(true);
    api
      .get("collection/list", { params: { pageNumber, pageSize } })
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
    setPagenation({ ...pagenation, pageNumber: value });
    getCollectionListApi(value, 8);
  };

  const downloadCollectionCSV = () => {};
  useEffect(() => {
    getCollectionListApi(1, 8);
  }, []);

  if (searchData.collection.length > 0 && searchData.url === "/collection") {
    return <HomeSearch />;
  }
  let headers = [
    { label: "Collection Name", key: "collection_name" },
    { label: "a number of collection items", key: "item_count" },
    { label: "topic name", key: "topic_id.topic_name" },
    { label: "user name", key: "user_id.user_name" },
  ];

  return (
    <Box className="mb-12">
      <Box className="flex justify-between mb-5">
        <Box className="flex justify-between items-center gap-x-3">
          <Typography variant="h6" className="text-base sm:text-xl">
            {t("allCollections")}
          </Typography>
          <CSVLink
            data={collectionList}
            headers={headers}
            className="no-underline"
          >
            <Button
              onClick={downloadCollectionCSV}
              variant="outlined"
              className="text-sm sm:text-base"
            >
              <DownloadIcon />
              {t("downloadcsv")}
            </Button>
          </CSVLink>
        </Box>

        {loginUser.role ? (
          <Button
            onClick={handleOpenModal}
            variant="contained"
            className="text-sm sm:text-base"
          >
            {t("createCollection")}
          </Button>
        ) : null}
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
      <ToastContainer />
    </Box>
  );
}

export default Collection;
