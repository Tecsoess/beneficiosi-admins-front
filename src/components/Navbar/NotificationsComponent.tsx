import {
    Box,
    IconButton,
    CircularProgress,
    Menu,
    Badge,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@material-ui/core";

import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useAuth } from "../../contexts/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import SystemInfo from "../../utils/SystemInfo";
import { useHistory } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import io from 'socket.io-client';
import useNotifications from "../../hooks/useNotifications";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const notificationInterface = io(`${process.env.REACT_APP_API_URL}`, { transports: ['websocket'] });

const NotificationsComponent = () => {

    const { user } = useAuth();

    const observer = useRef<any>();

    const history = useHistory();

    const [filters, setFilters] = useState({ page: 1, sort: "createdAt,DESC", forUserId: user?.id });

    const [showNotifications, setShowNotifications] = useState<null | HTMLElement>(null);

    const [{ notifications: newNotifications, error: notificationsError, loading: notificationsLoading, numberOfPages: notificationsNumberOfPages }, getNotifications] = useNotifications({ options: { manual: true, useCache: false }, axiosConfig: { params: { ...filters } } });

    const [{ data: seenNotificationsData }, notificationsMarkAsSeen] = useAxios({ url: "/notifications/mark-all-as-seen", method: "DELETE" }, { manual: true, useCache: false });

    const [notifications, setNotification] = useState<any>([]);
    const [notificationsNumber, setNotificationsNumber] = useState<number>(0);


    const lastNotificationRef = useCallback((notification: any) => {
        if (notificationsLoading) return
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && notificationsNumberOfPages > filters.page) {
                setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        page: oldFilters.page + 1
                    }
                })
            }
        })
        if (notification) observer?.current?.observe?.(notification)
    }, [notificationsLoading, notificationsNumberOfPages]);

    useEffect(() => {
        getNotifications({ params: { ...filters } })
    }, [filters])

    useEffect(() => {
        setNotificationsNumber(notifications?.filter((notification: any) => !notification?.userToNotification?.seen).length);
    }, [notifications]);

    useEffect(() => {
        if (notificationsNumber > 0) {
            document.title = `(${notificationsNumber}) ${SystemInfo.name}`
        } else {
            document.title = `${SystemInfo.name}`
        }
    }, [notificationsNumber])

    useEffect(() => {
        setNotification((oldNotifications: any[]) => {
            return [...oldNotifications, ...newNotifications]
        });
    }, [newNotifications]);

    useEffect(() => {
        if (user && notificationInterface) {
            notificationInterface.on(`user.${user?.id}`, handleNotification);
            notificationInterface.on(`ADMIN`, handleNotification);
            getNotifications({ params: { ...filters } });
        }
    }, [user, notificationInterface]);

    const handleNotification = (notification: any) => {
        setNotification((oldNotifications: any[]) => {
            return [notification, ...oldNotifications];
        })
    }

    const toggleNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
        setShowNotifications(event.currentTarget);
    }

    const handleCloseNotifications = (notification: any) => {
        if (notification) {
            if (notification.type === "ORDER_STATUS_CHANGE" || notification.type === "ORDER_CREATED") {
                history.push(`/orders-management/orders/${notification?.additionalData?.orderId}/edit`)
            }
        }
        console.log(notification);
        setShowNotifications(null);
        setNotificationsNumber(0)
        notificationsMarkAsSeen();
    }

    return (
        <>
            <IconButton color="primary" aria-controls="notifications" aria-haspopup="true" onClick={toggleNotifications}>
                <Badge badgeContent={notificationsNumber} color="primary">
                    <NotificationsActiveIcon />
                </Badge>
            </IconButton>
            <Menu
                id="notifications"
                className="custom-scroll"
                anchorEl={showNotifications}
                keepMounted
                open={Boolean(showNotifications)}
                onClose={handleCloseNotifications}
            >
                <ListItem button>
                    <Box component="h3" m={1} color="gray" textAlign="center">
                        Notificaciones
                    </Box>
                </ListItem>
                {
                    notifications.length > 0 ?

                        notifications?.map((notification: any, i: number) => {
                            return (
                                <ListItem ref={i + 1 === notifications.length ? lastNotificationRef : null} key={i} button onClick={() => { handleCloseNotifications(notification) }}>
                                    <ListItemIcon>
                                        <ListAltIcon style={{ color: notification?.additionalData?.color }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<Box><Box>{notification?.message}</Box> <Box>{notification?.createdAt}</Box></Box>} />
                                    {
                                        !notification?.userToNotification?.seen ?
                                            <IconButton edge="end" color="primary">
                                                <FiberManualRecordIcon />
                                            </IconButton>
                                            :
                                            null
                                    }
                                </ListItem>
                            )
                        })
                        :
                        <Box px={5}>
                            No tienes notificaciones
                        </Box>
                }
                {
                    notificationsLoading ?
                        <ListItem button>
                            <CircularProgress style={{ margin: "auto" }} />
                        </ListItem>
                        :
                        null
                }
            </Menu>
        </>
    )
}

export default NotificationsComponent;