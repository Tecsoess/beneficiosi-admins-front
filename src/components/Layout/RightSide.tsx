import { Box } from "@material-ui/core";
import NavBar from "../Navbar/NavBar";

const RightSide = ({ children }: any) => {
    return (
        <Box width='100%' overflow="auto hidden" minWidth="0">
            <NavBar />
            <div style={{ padding: "1rem" }}>
                {children}
            </div>
        </Box>
    )
}

export default RightSide;