import { Button, makeStyles } from "@material-ui/core";

import LanguageIcon from '@material-ui/icons/Language';
import NotificationsComponent from "./NotificationsComponent";
import UserProfile from "./UserProfile";

const useStyles = makeStyles((theme) => {
    return {
        navBar: {
            background: 'white',
            padding: "1rem",
            justifyContent: 'flex-end',
            display: 'flex',
            maxWidth: "100%",
            alignItems: 'center',
            color: theme.palette.grey[500]
        }
    }
})

const NavBar = () => {

    const classes = useStyles();

    return (
        <div className={classes.navBar}>

            <a target="_blank" href={`${process.env.REACT_APP_HOST}`} style={{ textDecoration: "none" }}>
                <Button startIcon={<LanguageIcon />} color="primary">
                    Ver Pagina
                </Button>
            </a>

            <NotificationsComponent />

            <UserProfile />

        </div>
    )
}

export default NavBar;