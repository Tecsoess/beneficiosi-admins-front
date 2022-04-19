import { CircularProgress, makeStyles, SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import clsx from "clsx";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  container: {
    textDecoration: "none",
    color: "inherit",
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: theme.spacing(17),
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    transition: "all .3s",
    "&:hover": {
      boxShadow: "5px 5px 15px 5px rgba(0,0,0,0.1);"
    }
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: 64,
  },
  primaryText: {
    color: theme.palette.primary.main,
  },
  infoText: {
    color: theme.palette.info.main,
  },
  successText: {
    color: theme.palette.success.main,
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  purpleText: {
    color: '#B400C3',
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  value: {
    fontSize: 44,
    fontWeight: 'bold',
    lineHeight: 1,
    margin: 0
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
  }
}));

type Props = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  iconColor?: 'primary' | 'info' | 'success' | 'warning' | 'purple';
  value: number | string;
  title: string;
  loading?: boolean;
  url?: string;
};

const StatCard = ({ icon, iconColor = 'primary', value, title, loading, url }: Props) => {
  const classes = useStyles();
  const Icon = icon;

  return <Link className={classes.container} to={url ? url : ""}>
    <div className={classes.root}>
      <div className={clsx(classes.iconContainer, {
        [classes.primaryText]: iconColor === 'primary',
        [classes.infoText]: iconColor === 'info',
        [classes.successText]: iconColor === 'success',
        [classes.warningText]: iconColor === 'warning',
        [classes.purpleText]: iconColor === 'purple',
      })}>
        <Icon fontSize="inherit" color="inherit" />
      </div>

      <div className={classes.data}>
        {
          loading ?
            <CircularProgress />
            :
            <p className={classes.value}>{value}</p>
        }
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  </Link>;
};

export default StatCard;
