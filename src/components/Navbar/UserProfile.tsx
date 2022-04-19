import { Box, Button, IconButton, Menu } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from "react";
import { Link } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const UserProfile = () => {

    const { user, setAuthInfo } = useAuth();

    const [showDetails, setShowDetails] = useState<null | HTMLElement>(null);

    const handleClose = () => {
        setShowDetails(null);
    };

    const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setShowDetails(event.currentTarget);
    };

    const logOut = () => {
        setAuthInfo?.({ user: null, token: null, isAuthenticated: false });
    }

    return (
        <Box>
            <IconButton aria-controls="profile-menu" onClick={handleClick2} aria-haspopup="true">
                {
                    user?.imgPath ?
                        <img style={{ height: 50, width: 50, borderRadius: "100%" }} src={`${process.env.REACT_APP_API_URL}/${user?.imgPath}`} alt="" />
                        :
                        <AccountCircleIcon />
                }
            </IconButton>
            <Menu
                id="profile-menu"
                anchorEl={showDetails}
                keepMounted
                open={Boolean(showDetails)}
                onClose={handleClose}
            >
                <Box px={2}>
                    <Box component="h3" color="gray">{user?.name}</Box>
                    <Box>
                        <Link to={`/users-management/admins/${user?.id}/edit`} style={{ textDecoration: "none" }}>
                            <Button color="primary" startIcon={<AccountCircleIcon />}>
                                My account
                            </Button>
                        </Link>
                    </Box>

                    <Box>
                        <Button onClick={logOut} color="primary" startIcon={<ExitToAppIcon />}>
                            Cerrar Sesion
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </Box>
    )
}

export default UserProfile;