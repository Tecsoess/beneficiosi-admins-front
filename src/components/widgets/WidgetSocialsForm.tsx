import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core"
import { WidgetFormsProps } from "./WidgetFormModal";

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { useState } from "react";
import { useEffect } from "react";

const WidgetSocialsForm = (props: WidgetFormsProps) => {

    const [socialData, setSocialData] = useState({ facebook: "", twitter: "", instagram: "", youtube: "" });

    const [canAccept, setCanAccept] = useState(false);

    useEffect(() => {
        for (let key in socialData) {
            if (socialData[key as keyof typeof socialData]) {
                setCanAccept(true);
                break;
            } else {
                setCanAccept(false);
            }
        }
    }, [socialData])

    const handleCancel = () => {
        props.onCancel();
    }

    const handleAccept = (e: any) => {
        e?.preventDefault();
        props.onAccept({
            ...socialData,
            type: 'socials'
        });
    }

    const handleChange = (e: any) => {
        setSocialData((oldSocialData) => {
            return {
                ...oldSocialData,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <Box hidden={props.hidden}>
            <DialogTitle>Añade tus redes sociales</DialogTitle>
            <DialogContent>
                <form onSubmit={handleAccept}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={socialData.facebook}
                                onChange={handleChange}
                                variant="outlined"
                                autoFocus
                                id="facebook"
                                label={
                                    <Box display="flex" alignItems="center">
                                        <FacebookIcon />
                                        facebook
                                    </Box>
                                }
                                type="text"
                                fullWidth
                                name="facebook"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={socialData.instagram}
                                onChange={handleChange}
                                variant="outlined"
                                id="instagram"
                                label={
                                    <Box display="flex" alignItems="center">
                                        <InstagramIcon />
                                        instagram
                                    </Box>
                                }
                                type="text"
                                fullWidth
                                name="instagram"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={socialData.twitter}
                                onChange={handleChange}
                                variant="outlined"
                                id="twitter"
                                label={
                                    <Box display="flex" alignItems="center">
                                        <TwitterIcon />
                                        twitter
                                    </Box>
                                }
                                type="text"
                                fullWidth
                                name="twitter"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={socialData.youtube}
                                onChange={handleChange}
                                variant="outlined"
                                id="youtube"
                                label={
                                    <Box display="flex" alignItems="center">
                                        <YouTubeIcon />
                                        youtube
                                    </Box>
                                }
                                type="text"
                                fullWidth
                                name="youtube"
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancelar
                </Button>
                <Button disabled={!canAccept} onClick={handleAccept} color="primary">
                    Aceptar
                </Button>
            </DialogActions>
        </Box>
    )
}

export default WidgetSocialsForm;