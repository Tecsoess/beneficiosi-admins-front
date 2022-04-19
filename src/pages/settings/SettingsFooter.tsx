import { Box, Grid, IconButton, makeStyles } from '@material-ui/core';

import { Link } from "react-router-dom";

import ViewDayOutlinedIcon from '@material-ui/icons/ViewDayOutlined';
import CreateIcon from '@material-ui/icons/Create';
import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import useAxios from '../../hooks/useAxios';

import FooterContainer from '../../components/FooterContainer';

const useStyles = makeStyles(theme => ({
  pageTilte: {
    color: theme.palette.grey[500],
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
  }
}));

const SettingsFooter = () => {

  const { setLoading } = useAuth();

  const [{ data, loading, error }, getFooterSections] = useAxios({ url: "settings/footer-sections" }, { useCache: true });

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading])

  useEffect(() => {
    console.log(data);
  }, [data])

  const [activeSections, setActiveSections] = useState<number[]>([]);

  const classes = useStyles();

  const handleActiveSection = (activeSectionNumber: number) => {
    const activeSection = activeSections.includes(activeSectionNumber);
    if (activeSection) {
      const newActiveSections = activeSections.filter(activeSection => activeSection !== activeSectionNumber)
      setActiveSections(newActiveSections);
    } else {
      setActiveSections([activeSectionNumber, ...activeSections]);
    }
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <ViewDayOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Configuración del Footer</h1>
        </div>
      </Box>

      <Box bgcolor="white" p={4}>
        <Box component="h2">Secciones del footer</Box>
        <Grid container spacing={10}>
          {
            Object.keys(data ? data : {}).map((key, i) => {
              return (
                <Grid item md={3} key={i}>
                  <FooterContainer
                    id={Number(data?.[key].id)}
                    title={data?.[key].name}
                    active={data?.[key].isActive}
                    widgets={data?.[key].widgets}
                    toggleActivate={handleActiveSection}
                  />

                </Grid>
              )
            })
          }
        </Grid>
      </Box>
    </div>
  )
}

export default SettingsFooter;
