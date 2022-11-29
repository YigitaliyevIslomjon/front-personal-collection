import { useState } from "react";

export const useModal = () => {
  const [visilble, setVisible] = useState<boolean>(false);

  const handleModalVisible = () => {
    setVisible(true);
  };

  return { visilble, setVisible, handleModalVisible };
};
