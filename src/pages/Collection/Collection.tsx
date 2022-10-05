import { useState } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CreateCollectionModal from "../../components/Collection/СreateCollectionModal";

function Collection() {
  const [createCollModalVisible, setCreateCollModalVisible] =
    useState<boolean>(false);

  const handleOpenModal = () => {
    setCreateCollModalVisible(true);
  };

  return (
    <Box>
      <Box className="flex justify-end mb-5">
        <Button onClick={handleOpenModal} variant="contained">
          Create Collection
        </Button>
      </Box>
      <Grid container>
        <Grid xs={12}>1</Grid>
      </Grid>
      {createCollModalVisible ? (
        <CreateCollectionModal
          setVisible={setCreateCollModalVisible}
          visible={createCollModalVisible}
        />
      ) : null}
    </Box>
  );
}

export default Collection;
