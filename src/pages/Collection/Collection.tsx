import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Button,
  CardActionArea,
  CardActions,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateCollectionModal from "../../components/Collection/СreateCollectionModal";
import api from "../../utils/api";
import { Link } from "react-router-dom";

type CollectionListType = {
  collection_name: string;
  description: string;
  mark_down: boolean;
  path: string;
  topic_id: {
    topic_name: string;
    _id: string;
  };
  user_id: {
    user_name: string;
    _id: string;
  };
  _id: string;
}[];

function Collection() {
  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<CollectionListType | []>(
    []
  );

  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  const getCollectionListApi = () => {
    api
      .get("collection/list")
      .then((res) => {
        console.log(res.data);
        setCollectionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCollectionListApi();
  }, []);

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Collection
        </Button>
      </Box>
      <Grid container>
        {collectionList.map((item, index) => (
          <Grid xs={3}>
            <div
              key={item._id}
              className="border-2 border-solid border-indigo-100 rounded p-2"
            >
              <Link to={item._id}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.path}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Lizard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles,
                        with over 6,000 species, ranging across all continents
                        except Antarctica
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        // setItemFieldVisible(true);
                        // setcollectionId(item._id);
                      }}
                    >
                      item field
                    </Button>
                    <Button
                      onClick={() => {
                        // setEditCrecollectionDioVisible(true);
                      }}
                      size="small"
                      color="success"
                      variant="contained"
                    >
                      edit
                    </Button>
                    <Button size="small" color="warning" variant="contained">
                      delete
                    </Button>{" "}
                  </CardActions>
                </Card>
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>
      {createCollModalVisible ? (
        <CreateCollectionModal
          setVisible={setCreateCollModalVisible}
          visible={createCollModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default Collection;
