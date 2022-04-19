import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
  },
  content: {
    padding: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  titleWithBorder: {
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  subTitle: {
    marginLeft: 'auto',
    fontWeight: 'normal',
    fontSize: '0.9rem',
  },
  bgPrimary: {
    backgroundColor: theme.palette.primary.main,
  },
  bgSuccess: {
    backgroundColor: theme.palette.success.main,
  },
  bgWarning: {
    backgroundColor: theme.palette.warning.main,
  },
  bgInfo: {
    backgroundColor: theme.palette.info.main,
  },
  textWhite: {
    color: '#fff',
  }
}));

type Props = {
  children?: ReactNode;
  title?: ReactNode;
  titleColor?: 'primary' | 'info' | 'success' | 'warning' | 'white',
  titleWithBorder?: boolean;
  subTitle?: string;
  className?: string;
  contentClassName?: string;
};

const Card = ({
  children,
  title,
  titleWithBorder = false,
  titleColor = 'white',
  subTitle,
  className,
  contentClassName
}: Props) => {
  const classes = useStyles();

  return <div className={clsx(classes.root, className)}>
    {title && <div className={clsx(classes.title, {
      [classes.titleWithBorder]: titleWithBorder,
      [classes.bgPrimary]: titleColor === 'primary',
      [classes.bgSuccess]: titleColor === 'success',
      [classes.bgInfo]: titleColor === 'info',
      [classes.bgWarning]: titleColor === 'warning',
      [classes.textWhite]: titleColor !== 'white',
    })}>
      <div>{title}</div>
      {subTitle && <span className={classes.subTitle}>{subTitle}</span>}
    </div>}
    {children && <div className={clsx(classes.content, contentClassName)}>{children}</div>}
  </div>;
};

export default Card;
