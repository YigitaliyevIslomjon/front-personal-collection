import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import api from "../../utils/api";
import EditCollectTopicModal from "../../adminComponents/AdminCollecation/EditCollectTopicModal";
import CreateCollectTopicModal from "../../adminComponents/AdminCollecation/CreateCollectTopicModal";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";

export type TopicTableType = {
  topic_name: string;
  _id: string;
}[];

export type TopicTableRowType = {
  topic_name: string;
  _id: string;
};

function AdminCollection() {
  const [collectTopicModalVisible, setCollectTopicModalVisible] =
    useState<boolean>(false);
  const [topicTableData, setTopicTableData] = useState<TopicTableType>([]);
  const [editTopicModalVisible, setEditTopicModalVisible] =
    useState<boolean>(false);

  const [topicTableRowData, setTopicTableRowData] = useState(
    {} as TopicTableRowType
  );

  const [topicTableLoading, setTopicTableLoading] = useState<boolean>(false);

  const topicTableColumn: GridColDef[] = [
    {
      field: "topic_name",
      headerName: "Topic name",
      minWidth: 150,
      flex: 10,
      sortable: false,
    },

    {
      field: "edit",
      headerName: "Tools",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center">
            <IconButton
              onClick={() => editTopicTableRow(params.row)}
              color="primary"
              component="label"
            >
              <EditIcon className="cursor-pointer" />
            </IconButton>
            <IconButton
              onClick={() => deleteTopicTableRow(params.row)}
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

  function editTopicTableRow(data: TopicTableRowType) {
    setEditTopicModalVisible(true);
    setTopicTableRowData(data);
  }

  function deleteTopicTableRow(data: TopicTableRowType) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTopicApi(data);
      }
    });
  }

  function deleteTopicApi(data: TopicTableRowType) {
    api
      .delete(`/topic/${data._id}`)
      .then((res) => {
        getTopicTableData(1, 10);
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  }

  const getTopicTableData = (pageNumber: any, pageSize: any) => {
    setTopicTableLoading(true);
    api
      .get("topic", { params: { pageNumber, pageSize } })
      .then((res) => {
        setTopicTableData(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setTopicTableLoading(false);
      });
  };

  const handleOpenModal = () => {
    setCollectTopicModalVisible(true);
  };
  useEffect(() => {
    getTopicTableData(1, 10);
  }, []);

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Topic
        </Button>
      </Box>
      <Grid container>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={topicTableData}
            columns={topicTableColumn}
            pageSize={5}
            loading={topicTableLoading}
            rowsPerPageOptions={[5]}
            getRowId={(row: GridValidRowModel) => row._id}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Grid>
      {collectTopicModalVisible ? (
        <CreateCollectTopicModal
          getTopicTableData={getTopicTableData}
          setVisible={setCollectTopicModalVisible}
          visible={collectTopicModalVisible}
        />
      ) : null}
      {editTopicModalVisible ? (
        <EditCollectTopicModal
          setVisible={setEditTopicModalVisible}
          visible={editTopicModalVisible}
          topicTableRowData={topicTableRowData}
          getTopicTableData={getTopicTableData}
        />
      ) : null}
      <ToastContainer />
    </Box>
  );
}

export default AdminCollection;
