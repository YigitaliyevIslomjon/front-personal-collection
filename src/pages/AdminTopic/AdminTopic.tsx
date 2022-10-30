import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import api from "../../utils/api";
import EditCollectTopicModal from "../../adminComponents/AdminTopic/EditTopicModal";
import CreateTopicModal from "../../adminComponents/AdminTopic/CreateTopicModal";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";
import delelteAlert from "../../components/SweetAlert/SweetAlert";
import { Topic, TopicList } from "../../types/topic.types";

function AdminCollection() {
  const [topicModalVisible, setTopicModalVisible] = useState<boolean>(false);
  const [topicTableData, setTopicTableData] = useState<TopicList>([]);
  const [editTopicModalVisible, setEditTopicModalVisible] =
    useState<boolean>(false);

  const [topicTableRowData, setTopicTableRowData] = useState({} as Topic);

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

  function editTopicTableRow(data: Topic) {
    setEditTopicModalVisible(true);
    setTopicTableRowData(data);
  }

  function deleteTopicTableRow(data: Topic) {
    delelteAlert(deleteTopicApi, data);
  }

  function deleteTopicApi(data: Topic) {
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

  const getTopicTableData = (pageNumber: number, pageSize: number) => {
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
    setTopicModalVisible(true);
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
      {topicModalVisible ? (
        <CreateTopicModal
          getTopicTableData={getTopicTableData}
          setVisible={setTopicModalVisible}
          visible={topicModalVisible}
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
