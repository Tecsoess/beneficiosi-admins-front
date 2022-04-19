import Dialog from '@material-ui/core/Dialog';
import WidgetImageForm from './WidgetImageForm';
import WidgetSocialsForm from './WidgetSocialsForm';
import WidgetTextForm from './WidgetTextForm';
import WidgetUrlForm from './WidgetUrlForm';

export interface WidgetFormModalProps {
    forWidget: "image" | "url" | "text" | "socials" | null;
    onClose: (e?: any) => void;
}

export interface WidgetFormsProps {
    hidden: boolean;
    onAccept: (e: any) => void,
    onCancel: () => void
}

const WidgetFormModal = (props: WidgetFormModalProps) => {

    const { forWidget, onClose } = props;

    const handleAccept = (e: any) => {
        onClose(e);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <Dialog fullWidth open={forWidget ? true : false} onClose={handleClose} aria-labelledby="form-dialog-title">
                <WidgetImageForm onCancel={handleClose} onAccept={handleAccept} hidden={forWidget !== "image"} />
                <WidgetSocialsForm onCancel={handleClose} onAccept={handleAccept} hidden={forWidget !== "socials"} />
                <WidgetTextForm onCancel={handleClose} onAccept={handleAccept} hidden={forWidget !== "text"} />
                <WidgetUrlForm onCancel={handleClose} onAccept={handleAccept} hidden={forWidget !== "url"} />
            </Dialog>
        </div>
    );
}

export default WidgetFormModal;