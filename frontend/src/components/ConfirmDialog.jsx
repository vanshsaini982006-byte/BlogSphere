import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({ open, onClose, onConfirm, title = "Are you sure?", description, loading }) => (
  <Modal open={open} onClose={onClose} title={title} footer={
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
    </>
  }>
    {description}
  </Modal>
);

export default ConfirmDialog;
