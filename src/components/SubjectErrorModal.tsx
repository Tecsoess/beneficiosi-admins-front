import { Box, Button, Dialog, DialogTitle, TextField } from "@material-ui/core";
import { useState } from "react";

const SubjectErrorModal = (props: any) => {
    const { onClose, open, title } = props;

    const [subject, setSubject] = useState("");

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!subject) {
            alert("El motivo no puede estar vacio.");
            return;
        }

        onClose(subject)
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <Box p={2}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
                    <Box p={2}>
                        <TextField
                            fullWidth
                            onChange={(e) => { setSubject(e.target.value) }}
                            value={subject}
                            name="subject"
                            label="Motivo"
                            placeholder="Motivo del error."
                            margin="dense" />
                    </Box>
                    <Box textAlign="center">
                        <Button style={{ margin: "0 10px" }} variant="contained" color="primary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button style={{ margin: "0 10px" }} type="submit" variant="contained" color="primary">
                            Aceptar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
}

export default SubjectErrorModal;