import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export type ItemCardType = {
  data: {
    item_name: string;
    collection_name: string;
    user_name: string;
    id: string;
    path: string;
    tags: string[];
  };
};

function ItemCard({ data }: ItemCardType) {
  return (
    <div className="border-2 border-solid border-indigo-100 rounded p-2">
      <Card className="h-full">
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            image={data.path}
            alt="green iguana"
          />
          <CardContent>
            <div className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                Name :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.item_name}
              </Typography>
            </div>
            <div className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                Author :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.user_name}
              </Typography>
            </div>
            <div className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                Collection :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.collection_name}
              </Typography>
            </div>
            <div className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                tags :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.tags.map((tag) => tag)}
              </Typography>
            </div>
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
    </div>
  );
}

export default ItemCard;
