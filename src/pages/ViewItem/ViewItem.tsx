import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Controller, useForm } from "react-hook-form";
import api from "../../utils/api";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import io from "socket.io-client";
import ItemCollectionCard from "../../components/ViewItem/ItemCollectionCard";
import CommentText from "../../components/ViewItem/CommentText";
import EditItemModal from "../../components/ViewItem/EditItemModal";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";
import delelteAlert from "../../components/SweetAlert/SweetAlert";

export type ItemDataType = {
  item_name: string;
  collection_id: {
    _id: string;
    collection_name: string;
  };
  path: string;
  _id: string;
  tags: any[];
  user_id: {
    user_name: string;
    _id: string;
  };
};

type ItemExtraFieldList = {
  int_field: { [key: string]: string }[];
  str_field: { [key: string]: string }[];
  textare_field: { [key: string]: string }[];
  checkbox_field: { [key: string]: string }[];
  date_field: { [key: string]: string }[];
};
type ItemCollectionCardType = {
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  item_count: number;
  topic_name: string;
};
type CommentFormType = {
  text: string;
};

type CommentListType = {
  text: string;
  user_name: string;
  id: string;
}[];

function ViewItem() {
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<CommentFormType>();

  const socket = useMemo(() => io("http://localhost:4000"), []);
  const { id } = useParams();
  const navigate = useNavigate();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState({} as ItemDataType);

  const [itemCollection, setItemCollection] = useState(
    {} as ItemCollectionCardType
  );

  const [itemExtraFieldList, setItemExtraFieldList] = useState(
    {} as ItemExtraFieldList
  );

  const [editItemModalVisible, setEditItemModalVisible] =
    useState<boolean>(false);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentList, setCommentList] = useState([] as CommentListType);

  const getItemCollection = (item_list: any) => {
    let id = item_list.collection_id?._id;
    api
      .get(`collection/${id}`)
      .then((res) => {
        let collection = res.data;
        setItemCollection({
          collection_name: collection.collection_name,
          user_name: collection.user_id.user_name,
          id: collection._id,
          path: collection.path,
          item_count: collection.item_count,
          topic_name: collection.topic_id.topic_name,
        });
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionLoading(false);
      });
  };

  const getItemDataByIdApi = () => {
    setItemLoading(true);
    setCollectionLoading(true);
    api
      .get(`item/${id}`)
      .then((res) => {
        setItemExtraFieldList(res.data.item_extra_field);
        let item_list = res.data.item_list;
        item_list.tags = item_list.tags.map((tag: any) => tag.tag_name);
        setItemData(item_list);
        console.log(item_list);
        getItemCollection(item_list);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setItemLoading(false);
      });
  };

  const edititemData = () => {
    setEditItemModalVisible(true);
  };

  const deleteitemDataById = () => {
    api
      .delete(`item/${id}`)
      .then((res) => {
        navigate("/item");
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };
  const deleteItemOnClick = () => {
    delelteAlert(deleteitemDataById);
  };

  const pressLikeButton = (like_status: boolean) => {
    setLikeStatus((prev) => !prev);
    api
      .post(`like`, {
        like_status: !like_status ? "1" : "0",
        item_id: id,
      })
      .then((res) => {
        setLikeCount(res.data.count);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getLikeCountApi = () => {
    api
      .get("like", { params: { item_id: id } })
      .then((res) => {
        setLikeCount(res.data.count);
        setLikeStatus(res.data.like_status.like_status === "1" ? true : false);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getCommentList = () => {
    api
      .get(`/comment/list/${id}`)
      .then((res) => {
        setCommentList(
          res.data.map((item: any) => ({
            text: item.text,
            user_name: item.user_id.user_name,
            id: item._id,
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const submitComment = (data: any) => {
    data.item_id = id;
    api
      .post("comment", data)
      .then((res) => {})
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getBackPerviewUrl = () => {
    window.history.back();
  };

  let userExist = Object.keys(loginUser).length === 0;

  const checkingRole = () => {
    if (
      loginUser?.role === "admin" ||
      itemData.user_id?._id === loginUser?._id
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getItemDataByIdApi();
    getLikeCountApi();
    getCommentList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem("commentList", JSON.stringify(commentList));
  });

  useEffect(() => {
    socket.on("send-comment", (data) => {
      let commentCopy: any = JSON.parse(
        localStorage.getItem("commentList") || "{}"
      );
      setCommentList([...commentCopy, data]);
    });

    return () => {
      socket.off("disconnect");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box className="mb-96">
      <Grid container columnSpacing={4}>
        <Grid xs={7}>
          <Button className="mb-2" onClick={getBackPerviewUrl}>
            <ArrowBackIcon />
            <Typography variant="body1">back</Typography>
          </Button>
          <div className="border-2 border-solid border-indigo-100 rounded p-2 pb-1">
            {!itemLoading ? (
              <img
                alt="rasm"
                src={itemData?.path}
                className="object-cover h-[330px] w-full cursor-pointer"
              />
            ) : (
              <Skeleton variant="rounded" width={"100%"} height={330} />
            )}
          </div>
          <Box className="flex flex-col gap-y-1 mt-2">
            <Box className="mb-1">
              <IconButton
                disabled={userExist ? true : false}
                className="cursor-pointer"
                onClick={() => pressLikeButton(likeStatus)}
              >
                <ThumbUpIcon style={likeStatus ? { color: "red" } : {}} />
              </IconButton>
              {likeCount}
            </Box>
            {checkingRole() ? (
              <Box className="flex gap-x-2">
                <Button variant="contained" onClick={edititemData}>
                  edit
                </Button>
                <Button
                  variant="contained"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={deleteItemOnClick}
                >
                  delete
                </Button>
              </Box>
            ) : null}

            {!itemLoading ? (
              <>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Name :{" "}
                  </Typography>
                  <Typography variant="body1">{itemData.item_name}</Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Collection :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {itemData.collection_id?.collection_name}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    Auther :{" "}
                  </Typography>
                  <Typography variant="body1">
                    {itemData?.user_id?.user_name}
                  </Typography>
                </Box>
                <Box className="flex gap-x-2">
                  <Typography variant="body1" className="font-semibold">
                    tags :
                  </Typography>
                  <Box>
                    {itemData.tags?.map((tag) => (
                      <Typography key={tag} variant="body1">
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </>
            ) : (
              <Stack spacing={2} className="mt-3">
                {Array(5)
                  .fill(0)
                  .map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={"40%"}
                      height={20}
                    />
                  ))}
              </Stack>
            )}

            {itemExtraFieldList.int_field?.map((item, index) => (
              <Box className="flex gap-x-2" key={index}>
                <Typography variant="body1" className="font-semibold">
                  {Object.keys(item)[0]} :
                </Typography>

                <Typography variant="body1">
                  {Object.values(item)[0]}
                </Typography>
              </Box>
            ))}
            {itemExtraFieldList.str_field?.map((item, index) => (
              <Box className="flex gap-x-2" key={index}>
                <Typography variant="body1" className="font-semibold">
                  {Object.keys(item)[0]} :
                </Typography>

                <Typography variant="body1">
                  {Object.values(item)[0]}
                </Typography>
              </Box>
            ))}
            {itemExtraFieldList.checkbox_field?.map((item, index) => (
              <Box className="flex gap-x-2" key={index}>
                <Typography variant="body1" className="font-semibold">
                  {Object.keys(item)[0]} :
                </Typography>

                <Typography variant="body1">
                  {Object.values(item)[0]}
                </Typography>
              </Box>
            ))}
            {itemExtraFieldList.textare_field?.map((item, index) => (
              <Box className="flex gap-x-2" key={index}>
                <Typography variant="body1" className="font-semibold">
                  {Object.keys(item)[0]} :
                </Typography>

                <Typography variant="body1">
                  {Object.values(item)[0]}
                </Typography>
              </Box>
            ))}
            {itemExtraFieldList.date_field?.map((item, index) => (
              <Box className="flex gap-x-2" key={index}>
                <Typography variant="body1" className="font-semibold">
                  {Object.keys(item)[0]} :
                </Typography>

                <Typography variant="body1">
                  {Object.values(item)[0]}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box className="mt-3">
            <Box className="flex gap-x-2">
              <Avatar className="capitalize self-end cursor-pointer">
                {userExist ? "Z" : loginUser.user_name.slice(0, 1)}
              </Avatar>
              <Box
                className="flex-1"
                component={"form"}
                id="comment_form"
                onSubmit={handleSubmit(submitComment)}
              >
                <Controller
                  control={control}
                  name="text"
                  render={({ field: { onChange } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      className="text-sm"
                      onChange={onChange}
                      label="add a comment"
                      variant="standard"
                      error={!!errors.text}
                      helperText={errors.text && errors.text.message}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box className="flex justify-end gap-x-1 mt-1">
              <Button type="reset" form={"comment_form"}>
                cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-100 hover:bg-gray-200"
                form={"comment_form"}
                disabled={userExist ? true : false}
              >
                comment
              </Button>
            </Box>
            <Box className="flex flex-col gap-y-4">
              {commentList.map((item: any) => {
                return <CommentText key={item.id} data={item} />;
              })}
            </Box>
          </Box>
        </Grid>
        <Grid xs={5}>
          <Typography variant="h6"> Collection of item</Typography>
          <Box className="flex flex-col gap-y-1 mt-3 overflow-y-scroll h-[40rem]">
            {collectionLoading ? (
              <Stack spacing={2} className="mt-3">
                {Array(5)
                  .fill(0)
                  .map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={"50%"}
                      height={140}
                    />
                  ))}
              </Stack>
            ) : Object.keys(itemCollection).length === 0 ? (
              <Typography variant="body1">there is no Collection</Typography>
            ) : (
              <ItemCollectionCard data={itemCollection} />
            )}
          </Box>
        </Grid>
      </Grid>

      {editItemModalVisible ? (
        <EditItemModal
          itemData={itemData}
          itemExtraFieldList={itemExtraFieldList}
          visible={editItemModalVisible}
          setVisible={setEditItemModalVisible}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default ViewItem;
