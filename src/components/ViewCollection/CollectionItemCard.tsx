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
    <Box className="flex flex-wrap gap-3">
      <Link
        to={`/item-view/${data.id}`}
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
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            item :{" "}
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {data?.item_name}
          </Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            collection :{" "}
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {data.collection_name}
          </Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            auther :{" "}
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {data?.user_name}
          </Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            tags :{" "}
          </Typography>
          <Typography
            variant="body2"
            className="first-letter:capitalize flex gap-2 flex-wrap"
          >
            {data?.tags.map((tag) => (
              <Box>{tag}</Box>
            ))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CollectionItemCard;
