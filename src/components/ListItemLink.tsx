import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { forwardRef, ReactElement, Ref, useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";

type ListItemLinkProps = {
  to?: string | null;
  icon: ReactElement;
  title: string;
  onClick?: () => void,
};

const ListItemLink = ({ to, icon, title, onClick }: ListItemLinkProps) => {

  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const history = useHistory();

  useEffect(() => {
    history.listen((location, action) => {
      setCurrentPath(location.pathname);
      console.log(location.pathname)
    });
  });

  const CustomLink = useMemo(
    () =>
      forwardRef((props, ref: Ref<HTMLAnchorElement> | undefined) => (
        to === null ? <div {...props} onClick={onClick} /> : <Link ref={ref} to={to as string} {...props} onClick={onClick} />
      )),
    [to, onClick],
  );

  return (
    <li>
      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </li>
  );
}

export default ListItemLink;
