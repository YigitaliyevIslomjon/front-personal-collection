import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Button,
  CardActionArea,
  CardActions,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import CreateItemModal from "../../components/Item/CreateItemModal";
import ItemCard from "../../components/ItemCard/ItemCard";

type itemListType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
}[];

function Item() {
  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);

  const handleOpenModal = () => {
    setCreateItemModalVisible(true);
  };

  const [itemList, setItemList] = useState<itemListType | []>([]);

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
        console.log(err);
      });
  };

  useEffect(() => {
    getItemListApi(10, 1);
  }, []);
  console.log(itemList);

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Item
        </Button>
      </Box>
      <Grid container spacing={3}>
        {itemList.map((item, index) => (
          <Grid xs={3}>
            <ItemCard data={item} />
          </Grid>
        ))}
      </Grid>
      {createItemModalVisible ? (
        <CreateItemModal
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default Item;
