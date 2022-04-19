import { IconButton, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import SystemInfo from "../../utils/SystemInfo";
import MenuLinks, { MenuLink } from "../../utils/MenuLinks";
import clsx from "clsx";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles((theme) => {
    return {
        leftBar: {
            minHeight: '100vh',
            width: '4rem',
            zIndex: 10,
            background: 'white',
            padding: '0.5rem 0.10rem'
        },

        linkLogo: {
            textAlign: 'center'
        },

        imageLogo: {
            width: '66.666667%',
            margin: 'auto',
        },
        menuLinks: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
            margin: '1rem 0',
            transition: 'all 500ms',
        },
        link: {
            transition: 'all 500ms',
            color: theme.palette.grey[500],
            '&:hover': {
                color: theme.palette.primary.main
            },
        },
        activeLink: {
            color: theme.palette.primary.main
        },

        subMenu: {
            minHeight: '100vh',
            width: '14%',
            background: 'white',
            borderLeft: `1px solid ${theme.palette.grey[200]}`,
            borderRight: `1px solid ${theme.palette.grey[200]}`,
            padding: '0 20px'
        },
        subMenuTitleContainer: {
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '20px',
            color: theme.palette.grey[500],
        },

        subMenuTitleIcon: {
            margin: '30px 0 0 0',
            fontSize: '45px'
        },

        subMenuTitle: {
            fontSize: '1.5rem',
            lineHeight: '2rem',
            textAlign: 'center',
            margin: 0
        },

        subMenuLink: {
            display: 'flex',
            color: theme.palette.grey[500],
            transition: 'all 500ms',
            alignItems: 'center',
            margin: '1rem 0',
            padding: '2px 4px',
            borderRadius: '0.25rem',
            '&:hover': {
                color: theme.palette.primary.main,
                background: '#FEE2E2'
            }
        },

        subMenuLinkIcon: {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
            marginRight: '0.5rem',
            margin: 0
        },

        subMenuLinkActive: {
            color: theme.palette.primary.main,
            background: "#FEE2E2"
        },
    }
})

const LeftSideBar = () => {

    const classes = useStyles();

    const { setAuthInfo } = useAuth();

    const [actualMenu, setActualMenu] = useState<null | MenuLink>(null);
    const [actualPath, setActualPath] = useState('');
    const [showSubMenu, setShowSubMenu] = useState(false);

    useEffect(() => {
        setActualPath(window?.location?.pathname);
    }, [window.location.pathname]);

    const handleClick = (link: MenuLink) => {
        if (link.children) {
            setShowSubMenu(true);
        } else {
            setShowSubMenu(false);
        }
        setActualMenu(link);
    }

    const logOut = () => {
        setAuthInfo?.({ user: null, token: null, isAuthenticated: false });
    }

    const toggleMenu = () => {
        setShowSubMenu((value) => !value);
    }

    return (
        <>
            <div className={classes.leftBar}>
                <div className={classes.linkLogo}>
                    <Link to={'/'}>
                        <img className={classes.imageLogo} src={SystemInfo.logo} alt={SystemInfo.name} />
                    </Link>
                </div>
                {
                    MenuLinks.map((link, i) => {
                        return (
                            <div key={i} className={classes.menuLinks}>
                                <Link
                                    title={link?.title}
                                    to={link.path}
                                    className={clsx([classes.link], {
                                        [classes.activeLink]: actualPath?.split('/')?.includes(link.path.substr(1))
                                    })}
                                    onClick={() => { handleClick(link) }}
                                >
                                    {<link.icon />}
                                </Link>
                            </div>
                        )
                    })
                }
                <div className={classes.menuLinks}>
                    <IconButton onClick={logOut} color="default" aria-label="upload picture" component="span">
                        <ExitToAppIcon />
                    </IconButton>
                </div>
                <div className={classes.menuLinks}>
                    <IconButton color="primary" onClick={toggleMenu}>
                        {
                            actualMenu?.children && showSubMenu ?
                                <ChevronLeftIcon />
                                :
                                <ChevronRightIcon />
                        }
                    </IconButton>
                </div>
            </div>
            {
                actualMenu?.children && showSubMenu ?
                    <div className={classes.subMenu}>
                        <div className={classes.subMenuTitleContainer}>
                            {<actualMenu.icon className={classes.subMenuTitleIcon} />}
                            <p className={classes.subMenuTitle}>
                                {actualMenu.title}
                            </p>
                        </div>


                        {
                            actualMenu.children ?
                                <div className="px-4">
                                    {
                                        actualMenu.children.map((subLink, i) => {
                                            return (
                                                <Link style={{ textDecoration: 'none' }} key={i} to={subLink.path}>
                                                    <div className={clsx([classes.subMenuLink], {
                                                        [classes.subMenuLinkActive]: subLink.path === actualPath
                                                    })}>
                                                        <p className={classes.subMenuLinkIcon}>
                                                            {<subLink.icon />}
                                                        </p>
                                                        <p>
                                                            {subLink.title}
                                                        </p>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </>
    )
}

export default LeftSideBar;