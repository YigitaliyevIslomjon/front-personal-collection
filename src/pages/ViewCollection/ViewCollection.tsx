import { Button, Box, Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditCollectionModal from "../../components/Collection/EditCollectionModal";
import CreateItemExtraFieldModal from "../../components/ViewCollection/CreateItemExtraFieldModal";
import ReactMarkdown from "react-markdown";
import api from "../../utils/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionItemCard from "../../components/ViewCollection/CollectionItemCard";

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
  const [collection, setCollection] = useState({} as CollectionType);
  const [editCollecModalVisible, setEditCollecModalVisible] =
    useState<boolean>(false);
  const [colleCtionItemList, setCollectionItemList] = useState(
    [] as CollectionItemListType
  );
  const [itemExtraFieldModalVisible, setItemExtraFieldModalVisible] =
    useState<boolean>(false);

  const getCollectionByIdApi = () => {
    api
      .get(`collection/${id}`)
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {});
  };

  const getCollectionItemListApi = () => {
    api
      .get(`collection/items`, { params: { collection_id: id } })
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
      .catch((err) => {});
  };

  useEffect(() => {
    getCollectionByIdApi();
    getCollectionItemListApi();
  }, []);

  const editCollection = () => {
    setEditCollecModalVisible(true);
  };

  const deleteCollection = () => {
    api
      .delete(`collection/${collection._id}`)
      .then((res) => {})
      .catch((err) => {});
  };
  const createItemExtraField = () => {
    setItemExtraFieldModalVisible(true);
  };

  const getBackPerviewUrl = () => {
    window.history.back();
  };

  return (
    <Box>
      <Grid container columnSpacing={4}>
        <Grid xs={7}>
          <Button className="mb-2" onClick={getBackPerviewUrl}>
            <ArrowBackIcon />
            <Typography variant="body1">back</Typography>
          </Button>
          <div className="border-2 border-solid border-indigo-100 rounded p-2 pb-1 ">
            <img
              alt="rasm"
              src={collection?.path}
              className="object-cover h-[330px] w-full cursor-pointer"
            />
          </div>
          <Box className="flex flex-col gap-y-1 mt-1">
            <Box className="flex gap-x-2 mb-1">
              <Button variant="contained" onClick={editCollection}>
                edit
              </Button>
              <Button
                variant="contained"
                className="bg-red-500 hover:bg-red-600"
                onClick={deleteCollection}
              >
                delete
              </Button>
              <Button
                variant="contained"
                className="bg-green-500 hover:bg-green-600"
                onClick={createItemExtraField}
              >
                add item field
              </Button>
              <Button variant="contained" color="primary">
                view item table
              </Button>
            </Box>
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
          </Box>
        </Grid>
        <Grid xs={5}>
          <Typography variant="h6"> Items of Colleciton</Typography>
          <Box className="flex flex-col gap-y-1 mt-3 overflow-y-scroll h-[40rem]">
            {colleCtionItemList.map((item) => (
              <CollectionItemCard data={item} />
            ))}
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
    </Box>
  );
}

export default ViewCollection;
