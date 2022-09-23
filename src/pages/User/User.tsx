import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";

type userTableType = {
  name: String;
  email: String;
  status: String;
  signIn_at: Date;
  signUp_at: Date;
}[];

function User() {
  const [userTableData, setUserTableData] = useState<userTableType>([]);

  const userTableColumn: GridColDef[] = [
    { field: "id", headerName: "ID", maxWidth: 150, flex: 1, sortable: false },

    {
      field: "name",
      headerName: "Name",
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
      type: "number",
      minWidth: 150,

      flex: 1,
      sortable: false,
    },
    {
      field: "signIn_at",
      headerName: "Last loogin time",
      description: "This column has a value getter and is not sortable.",

      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "signUp_at",
      headerName: "Registration time",
      description: "This column has a value getter and is not sortable.",

      minWidth: 150,
      flex: 1,
      sortable: false,
    },
  ];
  const userRowData = [
    { id: 1, name: "Snow", status: "Jon", signUp_at: 35, signIn_at: 23 },
  ];
  const unblockUserLoogin = () => {};
  const blockUserLogin = () => {};
  const deleteSelectUser = () => {};

  const selectUserList = (data: GridSelectionModel) => {
    console.log(data);
  };
  const toolBarContent = () => {
    return (
      <div className="flex justify-end my-2 gap-x-2 items-center">
        <Button onClick={unblockUserLoogin} variant={"contained"} className="">
          Block
        </Button>
        <LockIcon onClick={blockUserLogin} className="cursor-pointer" />
        <DeleteIcon onClick={deleteSelectUser} className="cursor-pointer" />
      </div>
    );
  };
  return (
    <div>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={userRowData}
          columns={userTableColumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={selectUserList}
          components={{
            Toolbar: toolBarContent,
          }}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}

export default User;
