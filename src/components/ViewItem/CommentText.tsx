import { Avatar, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { CommentTextProp } from "../../types/comment.types";

function CommentText({ data }: CommentTextProp) {
  let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  return (
    <Box className="flex gap-x-2 items-center">
      <Avatar className="capitalizetext-white" sx={{ backgroundColor: color }}>
        {"A".slice(0, 1)}
      </Avatar>
      <Box>
        <Typography variant="body2">username</Typography>
        <Typography variant="body2">{data?.text}</Typography>
      </Box>
    </Box>
  );
}

export default CommentText;
