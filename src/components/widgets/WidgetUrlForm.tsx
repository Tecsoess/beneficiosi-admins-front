import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import { useState } from "react";
import { WidgetFormsProps } from "./WidgetFormModal";

const WidgetUrlForm = (props: WidgetFormsProps) => {

    const [urlData, setUrlData] = useState({ value: "", url: "" });

    const handleCancel = () => {
        props.onCancel();
    }

    const handleAccept = (e: any) => {
        e.preventDefault();
        props.onAccept({
            ...urlData,
            type: 'url'
        });
    }

    const handleChange = (e: any) => {
        setUrlData((oldUrlData) => {
            return {
                ...oldUrlData,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <Box hidden={props.hidden}>
            <DialogTitle>Añade la url</DialogTitle>
            <DialogContent>
                <form onSubmit={handleAccept}>
                    <TextField
                        onChange={handleChange}
                        value={urlData.value}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        id="name"
                        label="Texto para mostrar"
                        type="text"
                        fullWidth
                        name="value"
                    />

                    <TextField
                        onChange={handleChange}
                        value={urlData.url}
                        margin="normal"
                        variant="outlined"
                        id="url"
                        label="url"
                        type="text"
                        fullWidth
                        name="url"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancelar
                </Button>
                <Button disabled={urlData.value.length > 0 && urlData.url.length > 0 ? false : true} onClick={handleAccept} color="primary">
                    Aceptar
                </Button>
            </DialogActions>
        </Box>
    )
}

export default WidgetUrlForm;