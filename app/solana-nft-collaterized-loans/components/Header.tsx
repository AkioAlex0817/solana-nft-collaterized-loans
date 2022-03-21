import Container from "@mui/material/Container";
import {AppBar, Button, Link, Stack, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import * as React from "react";
import {useAnchorWallet} from "@solana/wallet-adapter-react";

const Header = () => {
    const wallet = useAnchorWallet();
    console.log(wallet);
    return (<AppBar position={"static"}>
            <Container maxWidth={"xl"}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
                    >
                        NFT Collaterized Loans
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {wallet ? (
                            <Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={5}>
                                <Link href="/" underline={"none"}>
                                    All Orders
                                </Link>
                                <Link href="/my_orders" underline={"none"}>
                                    My orders
                                </Link>
                                <Link href="/my_loans" underline={"none"}>
                                    My Loans
                                </Link>
                                <Link href="/my_payback" underline={"none"}>
                                    My Paybacks
                                </Link>
                            </Stack>) : ''}
                    </Box>
                    <Stack direction={"row"} gap={3}>
                        {wallet ? <Button variant="contained" size={"small"}>Create New Order</Button> : ''}
                        <WalletMultiButton/>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;