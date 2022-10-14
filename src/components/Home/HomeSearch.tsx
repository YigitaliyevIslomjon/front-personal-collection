import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ItemListType } from "../../pages/Home/Home";
import CollectionCard from "../CollectionCard/CollectionCard";
import ItemCard from "../ItemCard/ItemCard";

function HomeSearch() {
  let searchItemList: ItemListType = useSelector(
    (state: any) => state.search.item
  );
  let searchCollectionList = useSelector(
    (state: any) => state.search.collection
  );
  let searchCommentList = useSelector((state: any) => state.search.comment);

  return (
    <Box className="mb-20">
      {searchCollectionList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6">searched collection list</Typography>
        </Box>
      ) : null}
      <Grid container spacing={3}>
        {searchCollectionList.map((item: any) => (
          <Grid xs={3}>
            <CollectionCard data={item} />
          </Grid>
        ))}
      </Grid>
      {searchItemList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6">searched item list</Typography>
        </Box>
      ) : null}
      <Grid container spacing={3}>
        {searchItemList.map((item: any) => (
          <Grid xs={3}>
            <ItemCard data={item} />
          </Grid>
        ))}
      </Grid>
      {searchCommentList.length > 0 ? (
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6">searched comment list</Typography>
        </Box>
      ) : null}
      <Grid container spacing={3}>
        {searchCommentList.map((item: any) => (
          <Grid xs={3}>
            <div className="border-2 border-solid border-indigo-100 rounded p-2">
              <Card className="h-full">
                <CardActionArea>
                  <CardContent>
                    <div className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Item :
                      </Typography>

                      <Link
                        to={`item/${item.item_id}`}
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
                    </div>
                    <div className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Author :
                      </Typography>
                      <Typography gutterBottom variant="body2" component="span">
                        {item.user_name}
                      </Typography>
                    </div>
                    <div className="flex gap-x-2">
                      <Typography gutterBottom variant="body2" component="span">
                        Comment :
                      </Typography>
                      <Typography gutterBottom variant="body2" component="span">
                        {item.text}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomeSearch;
