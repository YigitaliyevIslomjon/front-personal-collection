import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment";
import "./ItemCard.scss";

export type ItemCardType = {
  data: {
    item_name: string;
    collection_name: string;
    user_name: string;
    id: string;
    path: string;
    tags: string[];
    created_at: string;
  };
};

function ItemCard({ data }: ItemCardType) {
  return (
    <Box
      id={"item-card"}
      className="border-2 border-solid border-indigo-100 rounded p-2"
    >
      <Card className="h-full">
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            className="card-img"
            image={data.path}
            alt="green iguana"
          />
          <CardContent>
            <Box className="flex gap-x-2">
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                Name :
              </Typography>
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                {data.item_name}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                Author :
              </Typography>
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                {data.user_name}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                Collection :
              </Typography>
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                {data.collection_name}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                tags :
              </Typography>
              <Typography
              
                gutterBottom
                variant="body2"
                component="span"
                className="flex gap-1 flex-wrap"
              >
                {data.tags.map((tag) => (
                  <Box key={tag}>{tag}</Box>
                ))}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                created at:
              </Typography>
              <Typography   className="first-letter:capitalize" gutterBottom variant="body2" component="span">
                {moment(data.created_at).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link to={`/item-view/${data.id}`} className="underline-offset-2">
            <Button size="small" color="primary" onClick={() => {}}>
              view item
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
}

export default ItemCard;
