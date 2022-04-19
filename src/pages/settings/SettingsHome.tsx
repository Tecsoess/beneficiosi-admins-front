import {
  Box
} from "@material-ui/core";

import HomeIcon from '@material-ui/icons/Home';

import SectionBusinessHome from "../../components/HomeSections/SectionBusinessHome";
import SectionAppHome from "../../components/HomeSections/SectionAppHome";
import SectionNecessaryInfoHome from "../../components/HomeSections/SectionNecessaryInfoHome";

const SettingsHome = () => {

  return (
    <div>
      <Box mb={4} display="flex" alignItems="center" component="h1" color="gray">
        <HomeIcon />
        Configuración del Home
      </Box>

      <SectionBusinessHome />

      <SectionAppHome />

      <SectionNecessaryInfoHome />
    </div>
  )
}

export default SettingsHome;
