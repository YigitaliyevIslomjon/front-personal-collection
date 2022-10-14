import { Box, Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import EditItemModal from "../../components/Item/EditItemModal";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Controller, useForm } from "react-hook-form";
import io from "socket.io-client";

import api from "../../utils/api";
export type ItemDataType = {
  item_name: string;
  collection_id: {
    _id: string;
    collection_name: string;
  };
  path: string;
  _id: string;
  tags: any[];
};
// export type ItemExtraFieldType = {};

type CommentFormType = {
  text: string;
};
function ViewItem() {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CommentFormType>();

  let { id } = useParams();
  const [itemData, setItemData] = useState({} as ItemDataType);
  const [itemExtraFieldList, setItemExtraFieldList] = useState({} as any);
  const [editItemModalVisible, setEditItemModalVisible] =
    useState<boolean>(false);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const getItemByIdApi = () => {
    api
      .get(`item/${id}`)
      .then((res) => {
        setItemExtraFieldList(res.data.item_extra_field);
        let item_list = res.data.item_list;
        item_list.tags = item_list.tags.map((tag: any) => tag.tag_name);
        console.log(item_list.tags);
        setItemData(item_list);
      })
      .catch((err) => {});
  };

  const edititemData = () => {
    setEditItemModalVisible(true);
  };

  const deleteitemData = () => {
    api
      .delete(`item/${id}`)
      .then((res) => {})
      .catch((err) => {});
  };

  const pressClickButton = (like_status: boolean) => {
    setLikeStatus((prev) => !prev);
    api
      .post(`like`, {
        like_status: !like_status ? "1" : "0",
        item_id: id,
      })
      .then((res) => {
        setLikeCount(res.data.count);
      })
      .catch((err) => {});
  };
  const getLikeCountApi = () => {
    api
      .get("like", { params: { item_id: id } })
      .then((res) => {
        setLikeCount(res.data.count);
        setLikeStatus(res.data.like_status.like_status === "1" ? true : false);
      })
      .catch((err) => {});
  };

  const submitComment = (data: any) => {
    data.item_id = id;
    api
      .post("comment", data)
      .then((res) => {})
      .catch((err) => {});
  };

  useEffect(() => {
    getItemByIdApi();
    getLikeCountApi();
  }, []);

  const [comment, setComment] = useState<any>([]);

  useEffect(() => {
    localStorage.setItem("comment", JSON.stringify(comment));
  });

  useEffect(() => {
    socket.on("send-comment", (data) => {
      let commentCopy: any = JSON.parse(
        localStorage.getItem("comment") || "{}"
      );
      setComment([data, ...commentCopy]);
    });

    return () => {
      socket.off("disconnect");
    };
  }, []);

  return (
    <div>
      <img alt="rasm" src={itemData?.path} />
      <div>{itemData?.item_name}</div>s
      <Button variant="contained" onClick={edititemData}>
        edit
      </Button>
      <Button variant="contained" onClick={deleteitemData}>
        delete
      </Button>
      <div>
        <IconButton>
          <ThumbUpIcon
            style={likeStatus ? { color: "red" } : {}}
            onClick={() => pressClickButton(likeStatus)}
          />
        </IconButton>
        {likeCount}
      </div>
      <div>
        <Box
          component={"form"}
          id="comment_form"
          onSubmit={handleSubmit(submitComment)}
        >
          <Controller
            control={control}
            name="text"
            rules={{ required: "text is required" }}
            render={({ field: { onChange } }) => (
              <TextField
                required
                size="small"
                fullWidth
                onChange={onChange}
                label="Name"
                variant="outlined"
                error={!!errors.text}
                helperText={errors.text && errors.text.message}
              />
            )}
          />
        </Box>
        <Button type="submit" form={"comment_form"}>
          submit
        </Button>
        {comment.map((item: any) => {
          return <div key={item._id}>{item.text}</div>;
        })}
      </div>
      {editItemModalVisible ? (
        <EditItemModal
          itemData={itemData}
          itemExtraFieldList={itemExtraFieldList}
          visible={editItemModalVisible}
          setVisible={setEditItemModalVisible}
        />
      ) : null}
    </div>
  );
}

export default ViewItem;
