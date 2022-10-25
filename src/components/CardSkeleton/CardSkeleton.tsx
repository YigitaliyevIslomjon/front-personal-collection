import React from "react";
import { Card, CardActionArea, CardActions, CardContent } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

function CardSkeletion() {
  return (
    <div className="border-2 border-solid border-indigo-100 rounded p-2">
      <Card className="h-full">
        <CardActionArea>
          <Skeleton variant="rectangular" width={"100%"} height={150} />
          <CardContent className="flex flex-col gap-y-2 pl-2">
            {Array(5)
              .fill(0)
              .map((item, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={"100%"}
                  height={10}
                />
              ))}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Skeleton variant="rounded" width={"20%"} height={10} />
        </CardActions>
      </Card>
    </div>
  );
}

export default CardSkeletion;
