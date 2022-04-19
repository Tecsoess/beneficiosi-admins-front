import StatCard from "../components/StatCard";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SectionTitle from "../components/SectionTitle";
import StoreIcon from '@material-ui/icons/Store';
import ListAltIcon from '@material-ui/icons/ListAlt';
import WidgetsIcon from '@material-ui/icons/Widgets';
import ChatIcon from '@material-ui/icons/Chat';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import { Grid, makeStyles, MenuItem, TextField, Typography } from "@material-ui/core";
import Card from "../components/Card";
import { ChangeEvent, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Ring from "../components/Ring";
import useAxios from "../hooks/useAxios";

const orderRings: {
  title: string;
  value: number;
  color: "primary" | "info" | "success" | "warning";
}[] = [
    { title: 'Rechazadas', value: 120, color: 'primary' },
    { title: 'En proceso', value: 210, color: 'warning' },
    { title: 'Finalizadas', value: 239, color: 'success' },
  ];

const useStyles = makeStyles(theme => ({
  mb: {
    marginBottom: theme.spacing(2),
  },
  activeAdsCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2)
    }
  },
  adsCardTitle: {
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      color: theme.palette.warning.main,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  },
  orderStatusCard: {
    display: 'flex',
    justifyContent: 'space-evenly',
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [data, setData] = useState({ month: 5, year: 2021 });

  const [{ data: summaryData, error: summaryError, loading: summaryLoading }] = useAxios({ url: `/summaries/dashboard` }, { useCache: false });

  const [{ data: ordersCount }] = useAxios({ url: `/orders/orders-count` }, { useCache: false });

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }


  useEffect(() => {
    console.log(summaryData);
  }, [summaryData])

  return <>
    <SectionTitle withMargin>Panel principal</SectionTitle>

    <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={6}>
        <StatCard
          icon={AccountCircleIcon}
          value={summaryData?.clientsCount}
          loading={summaryLoading}
          title={'Clientes'}
          url={`/users-management/clients`}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatCard
          icon={StoreIcon}
          iconColor="info"
          value={summaryData?.storesCount}
          loading={summaryLoading}
          title={'Tiendas'}
          url={`/users-management/stores`}
        />
      </Grid>
    </Grid>

    <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={ListAltIcon}
          iconColor="warning"
          value={summaryData?.ordersCount}
          loading={summaryLoading}
          title={'Ordenes'}
          url={`/orders-management/orders`}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={WidgetsIcon}
          iconColor="success"
          value={summaryData?.productsCount}
          loading={summaryLoading}
          title={'Productos'}
          url={`/catalog/products`}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={LoyaltyIcon}
          iconColor="warning"
          value={summaryData?.adsCount}
          loading={summaryLoading}
          title={'Publicidades'}
          url={`/ads-management/publicity-banner`}
        />
      </Grid>
    </Grid>

    {/* <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={6}>
        <Card>
          <Grid container spacing={2} className={classes.mb}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="month"
                label="Mes"
                value={data.month}
                onChange={handleChange}
              >
                <MenuItem value={4}>Abril</MenuItem>
                <MenuItem value={5}>Mayo</MenuItem>
                <MenuItem value={6}>Junio</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="year"
                label="Año"
                value={data.year}
                onChange={handleChange}
              >
                <MenuItem value={2019}>2019</MenuItem>
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid> */}

    {/* <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={6}>
        <Card title="Clientes y tiendas registradas" subTitle="Mayo">
          <Chart
            options={{
              xaxis: {
                categories: ['01/05', '15/05', '23/05', '31/05']
              },
              stroke: {
                curve: 'smooth',
                width: 2,
              },
              fill: {
                opacity: 60
              }
            }}
            type="area"
            height={397}
            series={[{
              name: 'Clientes',
              data: [0, 1500, 2300, 3600, 3360],
            }, {
              name: 'Tiendas',
              data: [0, 73, 206, 500, 960],
            }]}
          />
        </Card>
      </Grid>
      <Grid container spacing={2} item xs={12} md={6}>
        <Grid item xs={12}>
          <Card
            title={<div className={classes.adsCardTitle}>
              <LoyaltyIcon />
              <span>Publicidades creadas</span>
            </div>}
            subTitle="Mayo"
          >
            <Chart
              options={{
                xaxis: {
                  categories: ['01/05', '15/05', '23/05', '31/05']
                },
                stroke: {
                  curve: 'smooth',
                  width: 2,
                  colors: ['#FDBC15']
                },
                fill: {
                  opacity: 60,
                  colors: ['#FDBC15']
                }
              }}
              type="area"
              height={190}
              series={[{
                name: 'Publicidades',
                data: [0, 52, 106, 360, 895],
              }]}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card contentClassName={classes.activeAdsCard}>
            <Ring value={5} color="warning" />
            <Typography align="center" variant="h5">
              Publicidades activas
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Grid> */}

    <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12}>
        <Card
          title="Estado de las ordenes"
          contentClassName={classes.orderStatusCard}
        >
          <Ring
            value={ordersCount?.canceled}
            title={"Rechazadas"}
            color="danger"
            size="medium"
          />
          <Ring
            value={ordersCount?.processing}
            title={"Pendientes"}
            color="warning"
            size="medium"
          />

          <Ring
            value={ordersCount?.completed}
            title={"Aceptadas"}
            color="success"
            size="medium"
          />
        </Card>
      </Grid>
    </Grid>
  </>;
};

export default Dashboard;
