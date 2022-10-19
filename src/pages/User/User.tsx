import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditUserModal from "../../adminComponents/User/EditUserModal";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import delelteAlert from "../../components/SweetAlert/SweetAlert";

export type UserTableType = {
  user_name: string;
  email: string;
  status: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  permissions: {
    block: boolean;
    view: boolean;
  }[];
}[];

export type UserTableRowType = {
  user_name: string;
  email: string;
  status: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  _id: string;
  permissions: {
    block: boolean;
    view: boolean;
  }[];
};

function User() {
  const navigate = useNavigate();
  const [userTableData, setUserTableData] = useState<UserTableType>([]);
  const [editUserModalVisible, setEditUserModalVisible] =
    useState<boolean>(false);

  const [userTableRowData, setUserTableRowData] = useState(
    {} as UserTableRowType
  );

  const [userTableLoading, setUserTableLoading] = useState<boolean>(false);

  const userTableColumn: GridColDef[] = [
    {
      field: "user_name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,

      flex: 1,
      sortable: false,
    },
    {
      field: "permissions",
      headerName: "Permissions",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <div>{params.row.permissions[1].view}</div>
          </div>
        );
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
              onClick={() => deleteUserTableRow(params.row)}
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

  function editUserTableRow(data: UserTableRowType) {
    setEditUserModalVisible(true);
    setUserTableRowData(data);
  }

  function deleteUserTableRow(data: UserTableRowType) {
    delelteAlert(deleteUserApi, data);
  }

  function deleteUserApi(data: UserTableRowType) {
    api
      .delete(`/user/${data._id}`)
      .then((res) => {
        toastifyMessage({});
        if (res.data.isInValidUser) {
          navigate("/sign/in/admin");
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        }
        getUserTableData(1, 10);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  }

  const getUserTableData = (pageNumber: any, pageSize: any) => {
    setUserTableLoading(true);
    api
      .get("user", { params: { pageNumber, pageSize } })
      .then((res) => {
        setUserTableData(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setUserTableLoading(false);
      });
  };

  useEffect(() => {
    getUserTableData(1, 10);
  }, []);

  return (
    <div>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={userTableData}
          columns={userTableColumn}
          pageSize={5}
          loading={userTableLoading}
          rowsPerPageOptions={[5]}
          getRowId={(row: GridValidRowModel) => row._id}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      {editUserModalVisible ? (
        <EditUserModal
          getUserTableData={getUserTableData}
          userTableRowData={userTableRowData}
          setVisible={setEditUserModalVisible}
          visible={editUserModalVisible}
        />
      ) : null}
      <ToastContainer />
    </div>
  );
}

export default User;
