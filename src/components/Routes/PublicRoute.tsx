import { ComponentType } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  component: ComponentType,
  path: string;
  exact?: boolean;
}

const PublicRoute = ({ component, path, exact = false }: Props) => {
  const { isAuthenticated } = useAuth();

  const Component = component;

  return <Route
    path={path}
    exact={exact}
    render={({ location }) => !isAuthenticated
      ? <Component />
      : <Redirect to={{
        pathname: '/dashboard',
        state: { from: location }
      }} />
    }
  />;
};

export default PublicRoute;
