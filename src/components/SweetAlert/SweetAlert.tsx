import Swal from "sweetalert2";

function delelteAlert(deleteDataApi: (data?: any) => void, data?: any) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      if (data) {
        deleteDataApi(data);
      } else {
        deleteDataApi();
      }
    }
  });
}
export default delelteAlert;
