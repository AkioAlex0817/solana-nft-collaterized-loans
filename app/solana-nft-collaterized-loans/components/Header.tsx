import Container from "@mui/material/Container";
import {AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, TextField, Toolbar} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import * as React from "react";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import {useProgram} from "../utils/usePrograms";
import {NFT_LOAN_KEY, STABLE_COIN_KEY, USDC_VAULT_KEY} from "../utils/consts";
import {Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {createOrder} from "../services/orders";

const endpoint = "https://explorer-api.devnet.solana.com";
const connection = new anchor.web3.Connection(endpoint);

const Header = () => {
    const wallet: any = useAnchorWallet();
    const [open, setOpen] = React.useState(false);
    const {program} = useProgram({connection, wallet});
    const [nft, setNft] = React.useState('');
    const [amount, setAmount] = React.useState(0);
    const [interest, setInterest] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleNftChange = (val: string) => {
        setNft(val);
    }

    const handleAmountChange = (val: number) => {
        setAmount(val);
    }

    const handleInterestChange = (val: number) => {
        setInterest(val);
    }

    const submitOrder = async () => {
        if (!program) return;
        if (loading || nft == '' || amount == 0 || interest == 0 || interest > amount) return;
        setLoading(true);
        const tx = await createOrder({program, connection, wallet, nft, amount, interest, duration: 10});
        setLoading(false);
        console.log(tx);
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
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
                        {wallet ? <Button variant="contained" size={"small"} onClick={handleClickOpen}>Create New Order</Button> : ''}
                        <WalletMultiButton/>
                    </Stack>
                </Toolbar>
                <Dialog open={open}>
                    <DialogTitle>Create Order</DialogTitle>
                    <DialogContent>
                        <Typography component={"span"} sx={{fontSize: "12px"}}>NFT Token Address</Typography>
                        <TextField
                            margin="dense"
                            id="nft_token_address"
                            size={"small"}
                            fullWidth
                            variant="outlined"
                            inputProps={{
                                value: nft,
                                onChange: (event) => {
                                    // @ts-ignore
                                    handleNftChange(event.target.value);
                                },
                            }}
                        />
                        <Typography component={"span"} sx={{fontSize: "12px"}}>Request Amount</Typography>
                        <TextField
                            margin="dense"
                            id="request_amount"
                            size={"small"}
                            fullWidth
                            variant="outlined"
                            inputProps={{
                                type: 'tel',
                                min: '0',
                                style: {textAlign: 'right'},
                                value: amount.toString(),
                                onChange: (event) => {
                                    // @ts-ignore
                                    handleAmountChange(parseInt(event.target.value));
                                },
                            }}
                        />
                        <Typography component={"span"} sx={{fontSize: "12px"}}>Interest Amount</Typography>
                        <TextField
                            margin="dense"
                            id="interest_amount"
                            size={"small"}
                            fullWidth
                            variant="outlined"
                            inputProps={{
                                type: 'tel',
                                min: '0',
                                style: {textAlign: 'right'},
                                value: interest.toString(),
                                onChange: (event) => {
                                    // @ts-ignore
                                    handleInterestChange(parseInt(event.target.value));
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton onClick={submitOrder} disabled={loading} loading={loading}>Add Order</LoadingButton>
                        <LoadingButton onClick={handleClose} disabled={loading}>Cancel</LoadingButton>
                    </DialogActions>
                </Dialog>
            </Container>
        </AppBar>
    );
}

export default Header;