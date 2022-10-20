import { Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditCollectionModal from "../../components/Collection/EditCollectionModal";
import CreateItemExtraFieldModal from "../../components/ViewCollection/CreateItemExtraFieldModal";
import ReactMarkdown from "react-markdown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionItemCard from "../../components/ViewCollection/CollectionItemCard";
import api from "../../utils/api";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";
import delelteAlert from "../../components/SweetAlert/SweetAlert";

export type CollectionType = {
  collection_name: string;
  description: string;
  mark_down: boolean;
  path: string;
  topic_id: {
    topic_name: string;
    _id: string;
  };
  user_id: {
    user_name: string;
    _id: string;
  };
  _id: string;
};

type CollectionItemListType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
}[];

function ViewCollection() {
  let { id } = useParams();
  const navigate = useNavigate();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [collection, setCollection] = useState({} as CollectionType);
  const [collectionItemListLoading, setCollectionItemListLoding] =
    useState<boolean>(false);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);

  const [editCollecModalVisible, setEditCollecModalVisible] =
    useState<boolean>(false);
  const [collectionItemList, setCollectionItemList] = useState(
    [] as CollectionItemListType
  );
  const [itemExtraFieldModalVisible, setItemExtraFieldModalVisible] =
    useState<boolean>(false);

  const getCollectionByIdApi = () => {
    setCollectionLoading(true);
    api
      .get(`collection/${id}`)
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionLoading(false);
      });
  };

  const getCollectionItemListByIdApi = (
    pageNumber: number,
    pageSize: number
  ) => {
    setCollectionItemListLoding(true);
    api
      .get(`collection/items`, {
        params: { collection_id: id, pageNumber, pageSize },
      })
      .then((res) => {
        setCollectionItemList(
          res.data.map((item: any) => ({
            item_name: item.item_name,
            collection_name: item.collection_id.collection_name,
            user_name: item.user_id.user_name,
            id: item._id,
            path: item.path,
            tags: item.tags.map((item: any) => item.tag_name),
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionItemListLoding(false);
      });
  };

  useEffect(() => {
    getCollectionByIdApi();
    getCollectionItemListByIdApi(1, 10);
    // eslint-disable-next-line
  }, []);

  const editCollection = () => {
    setEditCollecModalVisible(true);
  };

  const deleteCollection = () => {
    api
      .delete(`collection/${collection._id}`)
      .then((res) => {
        toastifyMessage({});
        navigate("/collection");
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const delelteCollectionOnClick = () => {
    delelteAlert(deleteCollection);
  };
  const createItemExtraField = () => {
    setItemExtraFieldModalVisible(true);
  };

  const getBackPerviewUrl = () => {
    window.history.back();
  };

  const checkingRole = () => {
    if (
      loginUser.role === "admin" ||
      collection.user_id?._id === loginUser._id
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Box>
      <Grid container columnSpacing={4} rowSpacing={5}>
        <Grid xs={12} md={7}>
          <Button className="mb-2" onClick={getBackPerviewUrl}>
            <ArrowBackIcon />
            <Typography variant="body1">back</Typography>
          </Button>
          <Box className="border-2 border-solid border-indigo-100 rounded p-2 pb-1 ">
            {!collectionLoading ? (
              <img
                alt="rasm"
                src={collection?.path}
                className="object-cover h-[200px] sm:h-[250px] md:h-[330px] w-full cursor-pointer"
              />
            ) : (
              <Skeleton variant="rounded" width={"100%"} height={330} />
            )}
          </Box>
          <Box className="flex flex-col gap-y-1 mt-2">
            <Box className="flex flex-wrap gap-2 mb-1">
              {checkingRole() ? (
                <>
                  <Button
                    variant="contained"
                    onClick={editCollection}
                    className="grow md:grow-0"
                  >
                    edit
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-red-500 hover:bg-red-600 grow md:grow-0"
                    onClick={delelteCollectionOnClick}
                  >
                    delete
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-green-500 hover:bg-green-600 grow md:grow-0"
                    onClick={createItemExtraField}
                  >
                    add item field
                  </Button>
                  <Link
                    to={`/collection-item-table/${id}`}
                    className="no-underline grow md:grow-0"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full"
                    >
                      view item table
                    </Button>
                  </Link>
                </>
              ) : null}
            </Box>

            {!collectionLoading ? (
              <>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Name :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {collection?.collection_name}
                  </Typography>
                </Box>

                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Mark down :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {String(collection?.mark_down)}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Topic :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {collection?.topic_id?.topic_name}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Auther :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {collection?.user_id?.user_name}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2 items-center ">
                  <Typography variant="body1" className="font-semibold">
                    Description :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {collection?.mark_down ? (
                      <ReactMarkdown>{collection?.description}</ReactMarkdown>
                    ) : (
                      collection?.description
                    )}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Number of items :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {collectionItemList.length}
                  </Typography>
                </Box>
              </>
            ) : (
              <Stack spacing={2} className="mt-3">
                {Array(5)
                  .fill(0)
                  .map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={"40%"}
                      height={20}
                    />
                  ))}
              </Stack>
            )}
          </Box>
        </Grid>
        <Grid xs={12} md={5}>
          <Typography
            variant="h6"
            className="text-base sm:text-lg md:text-xl font-semibold"
          >
            {" "}
            Items of Colleciton
          </Typography>
          <Box className="flex flex-col gap-y-3 mt-4 overflow-y-scroll h-[40rem] sm:gap-y-1">
            {collectionItemListLoading ? (
              <Stack spacing={2} className="mt-3">
                {Array(5)
                  .fill(0)
                  .map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={"50%"}
                      height={140}
                    />
                  ))}
              </Stack>
            ) : collectionItemList.length === 0 ? (
              <Typography variant="body1">there is no items</Typography>
            ) : (
              collectionItemList.map((item) => (
                <CollectionItemCard key={item.id} data={item} />
              ))
            )}
          </Box>
        </Grid>
      </Grid>

      {editCollecModalVisible ? (
        <EditCollectionModal
          collection={collection}
          setVisible={setEditCollecModalVisible}
          visible={editCollecModalVisible}
        />
      ) : null}
      {itemExtraFieldModalVisible ? (
        <CreateItemExtraFieldModal
          setVisible={setItemExtraFieldModalVisible}
          visible={itemExtraFieldModalVisible}
          collection={collection}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default ViewCollection;
