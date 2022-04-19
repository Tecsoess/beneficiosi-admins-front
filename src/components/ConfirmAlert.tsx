import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type ConfirmAlertProps = {
  onConfirm?: (e?: any) => void;
  onCancel?: () => void;
  cancelButton?: {
    text: string,
    color: 'default' | "inherit" | "primary" | "secondary";
    variant: 'contained' | 'outlined' | 'text';
  };
  acceptButton?: {
    text: string,
    color: 'default' | "inherit" | "primary" | "secondary";
    variant: 'contained' | 'outlined' | 'text';
  };
  show: boolean;
  onClose?: (e?: any) => any;
  description?: string;
  title: string;
}

const ConfirmAlert = ({ onClose, onConfirm, onCancel, cancelButton, acceptButton, show, title, description }: ConfirmAlertProps) => {

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  }

  const handleConfirm = () => {
    onConfirm?.(true);
    onClose?.(true);
  }

  return (
    <div>
      <Dialog
        open={show}
        keepMounted
        onClose={() => { onClose?.() }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        {
          description ?
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {description}
              </DialogContentText>
            </DialogContent>
            :
            null
        }

        <DialogActions>
          {
            cancelButton ?
              <Button variant={cancelButton.variant} onClick={handleCancel} color={cancelButton.color}>
                {cancelButton.text}
              </Button>
              :
              <Button variant="contained" onClick={handleCancel} color="primary">
                Cancelar
              </Button>
          }
          {
            acceptButton ?
              <Button variant={acceptButton.variant} onClick={handleConfirm} color={acceptButton.color}>
                {acceptButton.text}
              </Button>
              :
              <Button variant="contained" onClick={handleConfirm} color="primary">
                Aceptar
              </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmAlert;
