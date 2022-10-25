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
export type CollectionCardType = {
  data: {
    collection_name: string;
    user_name: string;
    id: string;
    path: string;
    item_count: number;
    topic_name: string;
  };
};

function CollectionCard({ data }: CollectionCardType) {
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
            <Box className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                Name :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.collection_name}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                Author :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.user_name}
              </Typography>
            </Box>
            <Box className="flex gap-x-2">
              <Typography gutterBottom variant="body2" component="span">
                topic :
              </Typography>
              <Typography gutterBottom variant="body2" component="span">
                {data.topic_name}
              </Typography>
            </Box>
            {data.item_count ? (
              <Box className="flex gap-x-2">
                <Typography gutterBottom variant="body2" component="span">
                  items :
                </Typography>
                <Typography gutterBottom variant="body2" component="span">
                  {data.item_count}
                </Typography>
              </Box>
            ) : null}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link
            to={`/collection-view/${data.id}`}
            className="underline-offset-2"
          >
            <Button size="small" color="primary" onClick={() => {}}>
              view collection
            </Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}

export default CollectionCard;
