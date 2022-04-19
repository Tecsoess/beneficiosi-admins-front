import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(1.5)
    }
  },
  root: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    fontWeight: 'bold',
  },
  medium: {
    border: '8px solid',
    width: theme.spacing(14),
    height: theme.spacing(14),
    fontSize: '2.5rem',
  },
  large: {
    border: '16px solid',
    width: theme.spacing(19),
    height: theme.spacing(19),
    fontSize: '2.8rem',
  },
  primary: {
    borderColor: theme.palette.primary.main,
  },
  info: {
    borderColor: theme.palette.info.main,
  },
  success: {
    borderColor: theme.palette.success.main,
  },
  warning: {
    borderColor: theme.palette.warning.main,
  },
  danger: {
    borderColor: theme.palette.error.main,
  },
}));

type Props = {
  value: string|number;
  color?: 'primary'|'info'|'success'|'warning'|'danger';
  title?: string;
  size?: 'medium'|'large';
};

const Ring = ({value, color, title, size = 'medium'}: Props) => {
  const classes = useStyles();
  return <div className={classes.wrapper}>
    <div className={clsx(classes.root, {
      [classes.medium]: size === 'medium',
      [classes.large]: size === 'large',
      [classes.primary]: color === 'primary',
      [classes.info]: color === 'info',
      [classes.success]: color === 'success',
      [classes.warning]: color === 'warning',
      [classes.danger]: color === 'danger',
    })}>
      {value}
    </div>

    {title && <Typography align="center" variant="h5">{title}</Typography>}
  </div>;
};

export default Ring;
