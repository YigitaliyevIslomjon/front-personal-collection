import React, { useState, useEffect } from "react";

import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { setConstantValue } from "typescript";
import delelteAlert from "../../components/SweetAlert/SweetAlert";
import EditItemModal from "../../components/ViewItem/EditItemModal";
import CreateItemModal from "../../components/Item/CreateItemModal";

type ItemListType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
}[];

type ItemListTableRowType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
};

type PagenationType = {
  pageNumber: number;
  pageSize: number;
  total_page_count: number;
};

function CollectionItemTable() {
  let { id } = useParams();

  const [itemListTableData, setItemListTableData] = useState<ItemListType>([]);
  const [itemTableLoading, setItemTableLoading] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string>("");
  const [editItemModalVisible, setEditItemModalVisible] =
    useState<boolean>(false);
  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);
  const tableColumn: GridColDef[] = [
    {
      field: "item_name",
      headerName: "Name",

      flex: 1,
      sortable: false,
    },
    {
      field: "user_name",
      headerName: "User",

      flex: 1,
      sortable: false,
    },
    {
      field: "tags",
      headerName: "Tags",

      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.tags?.map((tag: string, index: number) => {
              return <Box key={index}>{tag}</Box>;
            })}
          </Box>
        );
      },
    },
    {
      field: "collection_name",
      headerName: "collection name",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return <div>{params.row.collection_name}</div>;
      },
    },
    {
      field: "edit",
      headerName: "Tools",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center">
            <IconButton
              onClick={() => editItemTableRow(params.row.id)}
              color="primary"
              component="label"
            >
              <EditIcon className="cursor-pointer" />
            </IconButton>
            <IconButton
              onClick={() => delteItemTableRow(params.row.id)}
              color="warning"
              component="label"
            >
              <DeleteIcon className="cursor-pointer" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 1,
    total_page_count: 1,
  } as PagenationType);

  function editItemTableRow(id: string) {
    setEditItemModalVisible(true);
    setItemId(id);
  }

  const deleteItemByIdApi = (id: string) => {
    api
      .delete(`item/${id}`)
      .then((res) => {
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };
  function delteItemTableRow(id: string) {
    delelteAlert(deleteItemByIdApi, id);
  }

  const getBackPerviewUrl = () => {
    window.history.back();
  };

  const createItem = () => {
    setCreateItemModalVisible(true);
  };
  const getItemListByCollectionIdApi = (
    pageNumber: number,
    pageSize: number
  ) => {
    setItemTableLoading(true);
    api
      .get(`collection/items`, {
        params: { collection_id: id, pageNumber, pageSize },
      })
      .then((res) => {
        setPagenation(res.data.pagenation);
        setItemListTableData(
          res.data.item.map((item: any) => ({
            item_name: item.item_name,
            collection_name: item.collection_id.collection_name,
            user_name: item.user_id.user_name,
            id: item._id,
            path: item.path,
            tags: item.tags.map((item: any) => item.tag_name),
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setItemTableLoading(false);
      });
  };

  useEffect(() => {
    getItemListByCollectionIdApi(1, 8);
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Button className="mb-2" onClick={getBackPerviewUrl}>
          <ArrowBackIcon />
          <Typography variant="body1">back</Typography>
        </Button>
        <Button variant={"contained"} onClick={createItem}>
          create item
        </Button>
      </Box>
      <Box className="mt-3" sx={{ height: 500, width: "100%" }}>
        <DataGrid
          className="overflow-x-scroll"
          rows={itemListTableData}
          columns={tableColumn}
          pageSize={5}
          loading={itemTableLoading}
          rowsPerPageOptions={[5]}
          getRowId={(row: GridValidRowModel) => row.id}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>

      {editItemModalVisible ? (
        <EditItemModal
          itemId={itemId}
          getItemDataByIdApi={getItemListByCollectionIdApi}
          setVisible={setEditItemModalVisible}
          visible={editItemModalVisible}
        />
      ) : null}
      {createItemModalVisible ? (
        <CreateItemModal
          getItemListApi={getItemListByCollectionIdApi}
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default CollectionItemTable;
