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
import TablePagination from "@mui/material/TablePagination";
import { UserList, UserType } from "../../types/user.types";
import { UserPagenation } from "../../types/pagenation.types";

function User() {
  const navigate = useNavigate();

  const [userListTableData, setUserListTableData] = useState<UserList>([]);

  const [editUserModalVisible, setEditUserModalVisible] =
    useState<boolean>(false);
  const [pagenation, setPagenation] = useState({
    pageNumber: 1,
    pageSize: 8,
    total_page_count: 8,
    total_user_count: 8,
  } as UserPagenation);
  const [userTableRowData, setUserTableRowData] = useState({} as UserType);
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

  const getUserList = (pageNumber: number, pageSize: number) => {
    setUserTableLoading(true);
    api
      .get("user", { params: { pageNumber, pageSize } })
      .then((res) => {
        setUserListTableData(res.data.user);
        setPagenation(res.data.pagenation);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setUserTableLoading(false);
      });
  };

  function editUserTableRow(data: UserType) {
    setEditUserModalVisible(true);
    setUserTableRowData(data);
  }

  function deleteUserTableRow(data: UserType) {
    delelteAlert(deleteUserApi, data);
  }

  function deleteUserApi(data: UserType) {
    api
      .delete(`/user/${data._id}`)
      .then((res) => {
        toastifyMessage({});
        if (res.data.isInValidUser) {
          navigate("/");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
        getUserList(1, 7);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number
  ) => {
    setPagenation({ ...pagenation, pageNumber: +pageNumber });
    getUserList(+pageNumber + 1, pagenation.pageSize);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagenation({ ...pagenation, pageSize: +event.target.value });
    getUserList(pagenation.pageNumber, +event.target.value);
  };

  useEffect(() => {
    getUserList(1, 7);
  }, []);

  return (
    <div>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ color: "text.primary" }}
          rows={userListTableData}
          columns={userTableColumn}
          pageSize={5}
          loading={userTableLoading}
          rowsPerPageOptions={[5]}
          getRowId={(row: GridValidRowModel) => row._id}
          components={{
            Pagination: () => (
              <TablePagination
                component="div"
                count={pagenation.total_user_count}
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
      {editUserModalVisible ? (
        <EditUserModal
          getUserList={getUserList}
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
