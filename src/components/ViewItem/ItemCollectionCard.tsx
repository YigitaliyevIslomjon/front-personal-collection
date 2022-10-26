import { Typography, Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type ItemCollectionCardType = {
  data: {
    collection_name: string;
    user_name: string;
    id: string;
    path: string;
    item_count: number;
    topic_name: string;
  };
};
function ItemCollectionCard({ data }: ItemCollectionCardType) {
  return (
    <Box className="flex flex-wrap gap-3">
      <Link
        to={`/collection-view/${data.id}`}
        className="border-2 border-solid border-indigo-100 rounded p-2 pb-1 cursor-pointer w-full sm:w-[245px] h-[145px]"
      >
        <img
          src={data.path}
          className="object-cover rounded w-full h-full"
          alt="rasm"
        />
      </Link>

      <Box className="flex flex-col gap-y-1 sm:mt-2">
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            Name :{" "}
          </Typography>
          <Typography variant="body2"> {data.collection_name}</Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            Author :
          </Typography>
          <Typography variant="body2"> {data.user_name}</Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            topic :
          </Typography>
          <Typography variant="body2"> {data.topic_name}</Typography>
        </Box>
        {data.item_count ? (
          <Box className="flex gap-x-1">
            <Typography variant="body2" className="font-medium">
              items :{" "}
            </Typography>
            <Typography variant="body2">{data.item_count}</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default ItemCollectionCard;
