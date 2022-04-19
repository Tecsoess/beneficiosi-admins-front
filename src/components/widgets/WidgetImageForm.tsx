import { useState } from 'react';
import { Box } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WidgetFormsProps } from './WidgetFormModal';
import ImgUploadInput from '../ImgUploadInput';

const WidgetImageForm = (props: WidgetFormsProps) => {

    const [image, setImage] = useState<any>(null);

    const handleCancel = () => {
        props.onCancel();
    }

    const handleAccept = () => {
        const data = new FormData();

        data.append('type', 'image');
        data.append('image', image, image.name);
        props.onAccept(data);
    }

    const handleChange = (e: any) => {
        setImage(
            e.target.files[0]
        );
    }

    return (
        <Box hidden={props.hidden}>
            <DialogTitle id="form-dialog-title">Añade una Imagen</DialogTitle>
            <DialogContent>
                <ImgUploadInput height="300px" previewFor="banner" width="100%" name="image" change={handleChange}></ImgUploadInput>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancelar
                </Button>
                <Button disabled={!image} onClick={handleAccept} color="primary">
                    Aceptar
                </Button>
            </DialogActions>
        </Box>
    )
}

export default WidgetImageForm;