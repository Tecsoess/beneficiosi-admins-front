import {
  makeStyles,
} from "@material-ui/core";


import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar";
import RightSide from "./RightSide";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    background: theme.palette.grey[200]
  },
}));

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {

  const classes = useStyles();

  return (
    <div className={classes.root} >
      <LeftSideBar />

      <RightSide>
        {children}
      </RightSide>
    </div >
  )
}

export default AppLayout;
