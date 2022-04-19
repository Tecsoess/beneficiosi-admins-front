import {
  Box,
  Grid,
  IconButton
} from '@material-ui/core';

import { Link } from "react-router-dom";

import CreateIcon from '@material-ui/icons/Create';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { useState } from 'react';
import useAxios from '../hooks/useAxios';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

type FooterContainerProps = {
  active: boolean;
  id: number;
  title: string;
  widgets?: any[];
} & Record<string, any>

const FooterContainer = (props: FooterContainerProps) => {

  const { active, id, title, widgets, className } = props;

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, updateActivated] = useAxios({ url: `/settings/footer-sections/${id}/toggle-active-state`, method: "PUT" }, { manual: true, useCache: false })

  const [isActivated, setIsActivated] = useState(active);

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ message: 'Se ha actualizado correctamente.', show: true, severity: "success" });
      setIsActivated((activated) => !activated);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }
  }, [error]);


  useEffect(() => {
    setLoading?.({ show: loading, message: "Actualizando datos" });
  }, [loading]);

  const toggleActivate = () => {
    updateActivated();
  }

  return (
    <Grid className={className} container justify="space-around">
      <Grid item xs={11} style={{ position: "relative", padding: 10 }}>
        {
          isActivated ?
            null
            :
            <Box position="absolute" top={0} left={0} width="100%" zIndex={10} height="100%" bgcolor="rgba(0,0,0, .1)">
            </Box>
        }
        <Box m={0} display="flex" component="h3" alignItems="center">
          {title}
          <IconButton>
            <Link to={`/settings/footer/${id}/edit`}>
              <CreateIcon></CreateIcon>
            </Link>
          </IconButton>
        </Box>
        {
          widgets && widgets.length > 0 ?
            widgets.map((widget) => {
              switch (widget.type) {
                case "text":
                  return (
                    <Box mb={2} key={widget.position}>
                      {widget.value}
                    </Box>
                  )

                case "image":
                  return (
                    <Box mb={2} key={widget.position}>
                      Aca va una imagen
                    </Box>
                  )

                case "url":
                  return (
                    <Box mb={2} key={widget.position}>
                      <a href={widget.url}>
                        {widget.value}
                      </a>
                    </Box>

                  )

                case "socials":
                  return (
                    <Box mb={2} key={widget.position}>
                      {widget.facebook ?
                        <a href={widget.facebook}>
                          <FacebookIcon />
                        </a>
                        :
                        null
                      }

                      {widget.instagram ?
                        <a href={widget.instagram}>
                          <InstagramIcon />
                        </a>
                        :
                        null
                      }

                      {widget.twitter ?
                        <a href={widget.twitter}>
                          <TwitterIcon />
                        </a>
                        :
                        null
                      }

                      {widget.youtube ?
                        <a href={widget.youtube}>
                          <YouTubeIcon />
                        </a>
                        :
                        null
                      }
                    </Box>
                  )
              }
            })
            :
            null
        }
      </Grid>
      <Grid item xs={1}>
        <input checked={isActivated} onChange={toggleActivate} type="checkbox" />
      </Grid>
    </Grid>
  )
}

export default FooterContainer;
