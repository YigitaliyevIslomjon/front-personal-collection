import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditUserDialog from "../../adminComponents/User/EditUserDialog";

type userTableType = {
  name: String;
  email: String;
  status: String;
  signIn_at: Date;
  signUp_at: Date;
}[];

function User() {
  const [userTableData, setUserTableData] = useState<userTableType>([]);
  const [editUserDialogVisible, setEditUserDialogVisible] =
    useState<boolean>(false);

  const [userTableLoading, setUserTableLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
      field: "status",
      headerName: "Status",
      minWidth: 150,

      flex: 1,
      sortable: false,
    },
    {
      field: "sign_in_at",
      headerName: "Last login time",
      description: "This column has a value getter and is not sortable.",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <div>{moment(params.row.sign_in_at).format("DD-MM-YYYY HH:mm")}</div>
      ),
    },
    {
      field: "sign_up_at",
      headerName: "Registration time",
      description: "This column has a value getter and is not sortable.",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <div>{moment(params.row.sign_up_at).format("DD-MM-YYYY HH:mm")}</div>
      ),
    },
    {
      field: "edit",
      headerName: "Tools",
      flex: 1,
      sortable: false,
      renderCell: () => {
        return (
          <div className="flex justify-center items-center">
            <IconButton onClick={editUser} color="primary" component="label">
              <EditIcon className="cursor-pointer" />
            </IconButton>
            <IconButton onClick={() => {}} color="warning" component="label">
              <DeleteIcon className="cursor-pointer" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  function editUser() {
    setEditUserDialogVisible(true);
  }

  const getUserTableData = (pageNumber: any, pageSize: any) => {
    setUserTableLoading(true);
    api
      .get("user", { params: { pageNumber, pageSize } })
      .then((res) => {
        setUserTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUserTableLoading(false);
      });
  };

  const sweetAlert = (data: () => void, message: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${message} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        data();
      }
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
      {editUserDialogVisible ? (
        <EditUserDialog
          setVisible={setEditUserDialogVisible}
          visible={editUserDialogVisible}
        />
      ) : null}
    </div>
  );
}

export default User;
