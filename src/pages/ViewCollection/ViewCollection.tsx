import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditCollectionModal from "../../components/Collection/EditCollectionModal";
import CreateItemExtraFieldModal from "../../components/ViewCollection/CreateItemExtraFieldModal";
import api from "../../utils/api";

export type CollectionType = {
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
};

function ViewCollection() {
  let { id } = useParams();
  const [collection, setCollection] = useState({} as CollectionType);
  const [editCollecModalVisible, setEditCollecModalVisible] =
    useState<boolean>(false);

  const [itemExtraFieldModalVisible, setItemExtraFieldModalVisible] =
    useState<any>({});
  const getCollectionByIdApi = () => {
    api
      .get(`collection/${id}`)
      .then((res) => {
        console.log(res.data);
        setCollection(res.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCollectionByIdApi();
  }, []);

  const editCollection = () => {
    setEditCollecModalVisible(true);
  };

  const deleteCollection = () => {
    api
      .delete(`collection/${collection._id}`)
      .then((res) => {})
      .catch((err) => {});
  };
  const createItemExtraField = () => {
    setItemExtraFieldModalVisible(true);
  };
  return (
    <div>
      <img alt="rasm" src={collection?.path} />
      <div>{collection?.collection_name}</div>
      <div>{collection?.description}</div>
      <div>{String(collection?.mark_down)}</div>
      <div>{collection?.topic_id?.topic_name}</div>
      <div>{collection?.user_id?.user_name}</div>

      <Button variant="contained" onClick={editCollection}>
        edit
      </Button>
      <Button variant="contained" onClick={deleteCollection}>
        delete
      </Button>
      <Button variant="contained" onClick={createItemExtraField}>
        itemExtraField
      </Button>

      {editCollecModalVisible ? (
        <EditCollectionModal
          collection={collection}
          setVisible={setEditCollecModalVisible}
          visible={editCollecModalVisible}
        />
      ) : null}
      {itemExtraFieldModalVisible ? (
        <CreateItemExtraFieldModal
          setVisible={setItemExtraFieldModalVisible}
          visible={itemExtraFieldModalVisible}
          collection={collection}
        />
      ) : null}
    </div>
  );
}

export default ViewCollection;
