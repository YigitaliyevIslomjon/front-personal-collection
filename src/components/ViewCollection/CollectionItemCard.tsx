import { Typography, Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type CollectionItemCardType = {
  data: {
    item_name: string;
    collection_name: string;
    user_name: string;
    id: string;
    path: string;
    tags: string[];
  };
};
function CollectionItemCard({ data }: CollectionItemCardType) {
  return (
    <Box className="flex gap-x-3">
      <Link
        to={`/item-view/${data.id}`}
        className="border-2 border-solid border-indigo-100 rounded p-2 pb-1 cursor-pointer"
      >
        <img
          width={"250px"}
          height="145px"
          src={data.path}
          className="object-cover rounded"
          alt="rasm"
        />
      </Link>
      <Box className="flex flex-col gap-y-1 mt-2">
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            item :{" "}
          </Typography>
          <Typography variant="body2">{data?.item_name}</Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            collection :{" "}
          </Typography>
          <Typography variant="body2">{data.collection_name}</Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            auther :{" "}
          </Typography>
          <Typography variant="body2">{data?.user_name}</Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography variant="body2" className="font-medium">
            tags :{" "}
          </Typography>
          <Typography variant="body2">
            {data?.tags.map((tag) => tag)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CollectionItemCard;
