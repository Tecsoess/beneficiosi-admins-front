import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import { useState } from "react";
import { WidgetFormsProps } from "./WidgetFormModal";

const WidgetTextForm = (props: WidgetFormsProps) => {

    const [textValue, setTextValue] = useState({ value: "" });

    const handleCancel = () => {
        props.onCancel();
    }

    const handleAccept = (e: any) => {
        e?.preventDefault();
        props.onAccept({
            type: 'text',
            value: textValue.value
        });
    }


    const handleChange = (e: any) => {
        setTextValue({
            ...textValue,
            [e.target.name]: e.target.value
        });
    }

    return (
        <Box hidden={props.hidden}>
            <DialogTitle>Escribe el texto</DialogTitle>
            <DialogContent>
                <form onSubmit={handleAccept}>
                    <TextField
                        value={textValue.value}
                        onChange={handleChange}
                        multiline
                        rows={5}
                        variant="outlined"
                        autoFocus
                        id="name"
                        label="texto"
                        type="text"
                        fullWidth
                        name="value"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancelar
                </Button>
                <Button disabled={textValue.value.length > 0 ? false : true} onClick={handleAccept} color="primary">
                    Aceptar
                </Button>
            </DialogActions>
        </Box>
    )
}

export default WidgetTextForm;