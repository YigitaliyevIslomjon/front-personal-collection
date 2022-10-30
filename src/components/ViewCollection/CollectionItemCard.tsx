import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { CollectionItemCardProp } from "../../types/collection.types";
import { Tag } from "../../types/item.types";

function CollectionItemCard({ data }: CollectionItemCardProp) {
  return (
    <Box className="flex flex-wrap gap-3">
      <Link
        to={`/item-view/${data._id}`}
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
            {data.collection_id?.collection_name}
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
            {data.user_id?.user_name}
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
            {data?.tags.map((tag: Tag) => (
              <Box key={tag._id}>{tag.tag_name}</Box>
            ))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CollectionItemCard;
