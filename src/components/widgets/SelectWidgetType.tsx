import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: red[100],
        color: red[600],
    },
});

export interface SelectWidgetValuesType {
    icon: any;
    value: "image" | "url" | "text" | "socials";
    text: string;
}

export interface SelectWidgetPropsType {
    open: boolean;
    onClose: (value: any) => void;
    values: SelectWidgetValuesType[];
    title: string;
}

const SelectWidgetType = (props: SelectWidgetPropsType) => {
    const classes = useStyles();

    const { onClose, open, values, title } = props;

    const handleClose = () => {
        onClose(null);
    };

    const handleListItemClick = (value: "image" | "url" | "text" | "socials") => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
            <List>
                {values.map((value, i) => (
                    <ListItem button onClick={() => handleListItemClick(value.value)} key={i}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                {value.icon}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={value.text} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default SelectWidgetType;