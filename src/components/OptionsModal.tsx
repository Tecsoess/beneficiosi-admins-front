import { List, Dialog, DialogTitle, ListItem, ListItemText, Avatar, ListItemAvatar } from "@material-ui/core";

const OptionsModal = (props: any) => {
    const { onClose, open, values, title } = props;

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value: any) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
            <List>
                {values.map((value: any, i: any) => (
                    <ListItem style={{ textTransform: "capitalize", justifyContent: "space-around" }} button onClick={() => handleListItemClick(value)} key={i}>
                        {
                            value?.color &&
                            <div style={{ backgroundColor: value?.color, height: 30, width: 30, borderRadius: "100%", marginRight: 10 }} />
                        }
                        <ListItemText primary={value?.name} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default OptionsModal;