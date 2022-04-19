import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  mb: {
    marginBottom: theme.spacing(2),
  }
}));

type Props = {
  children: ReactNode;
  withMargin?: boolean;
};

const SectionTitle = ({children, withMargin = false}: Props) => {
  const classes = useStyles();

  return <Typography
    component="h2"
    variant="h5"
    className={clsx({[classes.mb]: withMargin})}
  >
    {children}
  </Typography>;
};

export default SectionTitle;
