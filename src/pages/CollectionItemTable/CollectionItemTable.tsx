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
import delelteAlert from "../../components/SweetAlert/SweetAlert";
import EditItemModal from "../../components/ViewItem/EditItemModal";
import CreateItemModal from "../../components/Item/CreateItemModal";
import TablePagination from "@mui/material/TablePagination";
import { ItemPagenation } from "../../types/pagenation.types";
import { ItemListTable, ItemType, Tag } from "../../types/item.types";

function CollectionItemTable() {
  let { id } = useParams();
  const [itemListTableData, setItemListTableData] = useState<ItemListTable>([]);
  const [itemTableLoading, setItemTableLoading] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string>("");
  const [editItemModalVisible, setEditItemModalVisible] =
    useState<boolean>(false);
  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);
  const tableColumn: GridColDef[] = [
    {
      field: "order",
      headerName: "№",
      flex: 1,
      sortable: false,
    },
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
    pageSize: 8,
    total_page_count: 8,
    total_item_count: 8,
  } as ItemPagenation);

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
        res.data.item.tags = res.data.item.tags.map((tag: Tag) => tag.tag_name);
        setItemListTableData(
          res.data.item.map((item: ItemType, index: number) => ({
            item_name: item.item_name,
            collection_name: item.collection_id.collection_name,
            user_name: item.user_id.user_name,
            id: item._id,
            path: item.path,
            tags: item.tags,
            order: index + 1,
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

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number
  ) => {
    setPagenation({ ...pagenation, pageNumber: +pageNumber });
    getItemListByCollectionIdApi(+pageNumber + 1, pagenation.pageSize);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagenation({ ...pagenation, pageSize: +event.target.value });
    getItemListByCollectionIdApi(pagenation.pageNumber, +event.target.value);
  };

  useEffect(() => {
    getItemListByCollectionIdApi(1, 7);
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
          loading={itemTableLoading}
          getRowId={(row: GridValidRowModel) => row.id}
          components={{
            Pagination: () => (
              <TablePagination
                component="div"
                count={pagenation.total_item_count}
                page={pagenation.pageNumber - 1}
                onPageChange={handleChangePage}
                rowsPerPage={pagenation.pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[7, 10, 20]}
              />
            ),
          }}
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
