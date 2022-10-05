import { useState } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateItemModal from "../../components/Item/CreateItemModal";

function Item() {
  const [createItemModalVisible, setCreateItemModalVisible] =
    useState<boolean>(false);

  const handleOpenModal = () => {
    setCreateItemModalVisible(true);
  };
  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Item
        </Button>
      </Box>
      <Grid container>
        <Grid xs={12}>1</Grid>
      </Grid>
      {createItemModalVisible ? (
        <CreateItemModal
          setVisible={setCreateItemModalVisible}
          visible={createItemModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default Item;
