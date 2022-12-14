import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { ItemCollectionCardProp } from "../../types/item.types";

function ItemCollectionCard({ data }: ItemCollectionCardProp) {
  return (
    <Box className="flex flex-wrap gap-3">
      <Link
        to={`/collection-view/${data._id}`}
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
            Name :{" "}
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {" "}
            {data.collection_name}
          </Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            Author :
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {" "}
            {data.user_id.user_name}
          </Typography>
        </Box>
        <Box className="flex gap-x-1">
          <Typography
            variant="body2"
            className="font-medium first-letter:capitalize"
          >
            topic :
          </Typography>
          <Typography variant="body2" className="first-letter:capitalize">
            {" "}
            {data.topic_id.topic_name}
          </Typography>
        </Box>
        {data.item_count ? (
          <Box className="flex gap-x-1">
            <Typography
              variant="body2"
              className="font-medium first-letter:capitalize"
            >
              items :{" "}
            </Typography>
            <Typography variant="body2" className="first-letter:capitalize">
              {data.item_count}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default ItemCollectionCard;
