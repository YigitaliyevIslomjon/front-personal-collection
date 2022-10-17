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
function CollectionItemTable() {
  let { id } = useParams();

  const [itemListTableData, setItemListTableData] = useState<ItemListType>([]);

  const [itemTableLoading, setItemTableLoading] = useState<boolean>(false);

  const itemListTableColumn: GridColDef[] = [
    {
      field: "item_name",
      headerName: "Item name",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "user_name",
      headerName: "User",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "tags",
      headerName: "Tags",
      minWidth: 150,
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
      minWidth: 150,
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
              onClick={() => editUserTableRow(params.row)}
              color="primary"
              component="label"
            >
              <EditIcon className="cursor-pointer" />
            </IconButton>
            <IconButton
              onClick={() => delteUserTableRow(params.row.id)}
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

  function editUserTableRow(data: ItemListTableRowType) {}

  function delteUserTableRow(id: string) {
    console.log(id);
  }

  const getBackPerviewUrl = () => {
    window.history.back();
  };

  const getItemListByCollectionIdApi = (
    pageNumber: number,
    pageSize: number
  ) => {
    api
      .get(`collection/items`, {
        params: { collection_id: id, pageNumber, pageSize },
      })
      .then((res) => {
        setItemListTableData(
          res.data.map((item: any) => ({
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
      });
  };

  useEffect(() => {
    getItemListByCollectionIdApi(1, 10);
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Button className="mb-2" onClick={getBackPerviewUrl}>
          <ArrowBackIcon />
          <Typography variant="body1">back</Typography>
        </Button>
        <Button variant={"contained"}>create item</Button>
      </Box>
      <Box className="mt-3" sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={itemListTableData}
          columns={itemListTableColumn}
          pageSize={5}
          //   loading={userTableLoading}
          rowsPerPageOptions={[5]}
          getRowId={(row: GridValidRowModel) => row.id}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Box>
  );
}

export default CollectionItemTable;
