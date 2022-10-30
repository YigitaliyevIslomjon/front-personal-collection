import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CollectionCard from "../CollectionCard/CollectionCard";
import ItemCard from "../ItemCard/ItemCard";
import CloseIcon from "@mui/icons-material/Close";
import { setSerachItemList } from "../../store/slice/searchSlice";
import { useTranslation } from "react-i18next";
import { ItemList } from "../../types/item.types";

function HomeSearch() {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  let searchItemList: ItemList = useSelector((state: any) => state.search.item);
  let searchCollectionList = useSelector(
    (state: any) => state.search.collection
  );
  let searchCommentList = useSelector((state: any) => state.search.comment);
  const clearTagFilter = () => {
    dispatch(setSerachItemList([]));
  };
  return (
    <Box className="mb-20 min-h-[400px]">
      {searchCollectionList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6" className="text-base sm:text-xl">
            {t("searchedCollections")}
          </Typography>
        </Box>
      ) : null}
      <Grid container spacing={{ xs: 4, md: 3 }}>
        {searchCollectionList.map((item: any) => (
          <Grid xs={12} sm={6} md={3} key={item.id}>
            <CollectionCard data={item} />
          </Grid>
        ))}
      </Grid>
      {searchItemList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6" className="text-base sm:text-xl">
            {t("searchedItems")}
          </Typography>
          <Button
            variant="contained"
            className="flex justify-between items-center"
            onClick={clearTagFilter}
          >
            <CloseIcon className="w-[22px] h-[22px]" />
            <Typography variant="body1">{t("clearFilter")}</Typography>
          </Button>{" "}
        </Box>
      ) : null}
      <Grid container spacing={{ xs: 4, md: 3 }}>
        {searchItemList.map((item: any) => (
          <Grid xs={12} sm={6} md={3} key={item.id}>
            <ItemCard data={item} />
          </Grid>
        ))}
      </Grid>
      {searchCommentList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6" className="text-base sm:text-xl">
            {t("searchedComments")}
          </Typography>
        </Box>
      ) : null}
      <Grid container spacing={{ xs: 4, md: 3 }}>
        {searchCommentList.map((item: any) => (
          <Grid xs={12} sm={6} md={3} key={item.id}>
            <Box className="border-2 border-solid border-indigo-100 rounded p-2">
              <Card className="h-full">
                <CardActionArea>
                  <CardContent>
                    <Box className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Item :
                      </Typography>

                      <Link
                        to={`item-view/${item.item_id}`}
                        className="underline-offset-2"
                      >
                        {" "}
                        <Typography
                          gutterBottom
                          variant="body2"
                          component="span"
                        >
                          {item.item_name}
                        </Typography>
                      </Link>
                    </Box>
                    <Box className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Author :
                      </Typography>
                      <Typography gutterBottom variant="body2" component="span">
                        {item.user_name}
                      </Typography>
                    </Box>
                    <Box className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Comment :
                      </Typography>
                      <Typography gutterBottom variant="body2" component="span">
                        {item.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomeSearch;
