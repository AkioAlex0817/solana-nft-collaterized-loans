import type {NextPage} from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import {useProgram} from "../utils/usePrograms";
import * as anchor from "@project-serum/anchor";
import {cancelOrder, createOrder, getOrders, liquidity, loanOrder, payBack} from "../services/service";
import {Alert, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {Order} from "../src/Models/Order";
import {styled} from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

const LabelValueTypography = styled(Typography)({
    color: "#4CDC8F",
    fontSize: "14px",
});

const SpanValueTypography = styled(Typography)({
    color: "#FFFFFF",
    fontSize: "14px",
});

const Home: NextPage = () => {
    const wallet: any = useAnchorWallet();
    const [orders, setOrders] = useState<Order[]>([]);
    const {program} = useProgram({connection, wallet});
    const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();
    const [loading, setLoading] = React.useState(false);

    //SnackBar
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);

    // Create Order
    const [open, setOpen] = React.useState(false);
    const [nft, setNft] = React.useState('');
    const [amount, setAmount] = React.useState(0);
    const [interest, setInterest] = React.useState(0);
    const [creating, setCreating] = React.useState(false);


    useEffect(() => {
        fetchOrders();
    }, [wallet, lastUpdatedTime]);

    const fetchOrders = async () => {
        if (wallet && program) {
            try {
                const orders = await getOrders({program});
                setOrders(orders);
            } catch (error) {
            }
        }
    }

    // Create Order Section
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

    const createOrderHandler = async () => {
        if (!program) return;
        if (creating || nft == '' || amount == 0 || interest == 0 || interest > amount) return;
        setCreating(true);
        const tx = await createOrder({program, wallet, nftToken: nft, amount, interest, duration: 120000});
        setCreating(false);
        if (tx) {
            setOpenSuccess(true);
            setOpen(false);
            setTimeout(() => {
                setLastUpdatedTime(Date.now());
            }, 5000);
        } else {
            setOpenError(true);
        }
    }
    //-------------------------------------------------------

    const handleSuccessClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const cancelOrderHandler = async (item: Order) => {
        if (!program) return;
        if (loading) return;
        setLoading(true);
        const tx = await cancelOrder({program, wallet, orderData: item});
        setLoading(false);
        if (tx) {
            setOpenSuccess(true);
            setTimeout(() => {
                setLastUpdatedTime(Date.now());
            }, 5000);
        } else {
            setOpenError(true);
        }
    }

    const loanHandler = async (item: Order) => {
        if (!program) return;
        if (loading) return;
        setLoading(true);
        const tx = await loanOrder({program, wallet, orderData: item});
        setLoading(false);
        if (tx) {
            setOpenSuccess(true);
            setTimeout(() => {
                setLastUpdatedTime(Date.now());
            }, 5000);
        } else {
            setOpenError(true);
        }
    }

    const payBackHandler = async (item: Order) => {
        if (!program) return;
        if (loading) return;
        setLoading(true);
        const tx = await payBack({program, wallet, orderData: item});
        setLoading(false);
        if (tx) {
            setOpenSuccess(true);
            setTimeout(() => {
                setLastUpdatedTime(Date.now());
            }, 5000);
        } else {
            setOpenError(true);
        }
    }

    const liquidityHandler = async (item: Order) => {
        if (!program) return;
        if (loading) return;
        setLoading(true);
        const tx = await liquidity({program, wallet, orderData: item});
        setLoading(false);
        if (tx) {
            setOpenSuccess(true);
            setTimeout(() => {
                setLastUpdatedTime(Date.now());
            }, 5000);
        } else {
            setOpenError(true);
        }
    }

    return (
        <Container maxWidth={"xl"} sx={{paddingTop: "10px"}}>
            {wallet ? <Button variant="contained" size={"small"} onClick={handleClickOpen}>Create New Order</Button> : ''}
            <Box sx={{height: "20px"}}/>
            {wallet ? orders.length > 0 ? <Box>
                    {
                        orders.map((item) => (
                            <Card key={item.orderId.toString()} sx={{marginBottom: "10px", position: "relative"}}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={10}>
                                            <Stack direction={"column"} spacing={2}>
                                                <Stack direction={"row"} spacing={2}>
                                                    <LabelValueTypography>Order Pubkey: </LabelValueTypography>
                                                    <SpanValueTypography>{item.key}</SpanValueTypography>
                                                </Stack>
                                                <Stack direction={"row"} spacing={2}>
                                                    <LabelValueTypography>Borrowers: </LabelValueTypography>
                                                    <SpanValueTypography>{item.borrowerDisplay}</SpanValueTypography>
                                                </Stack>
                                                <Stack direction={"row"} spacing={2}>
                                                    <LabelValueTypography>NFT Token: </LabelValueTypography>
                                                    <SpanValueTypography>{item.nftMint.toBase58()}</SpanValueTypography>
                                                </Stack>
                                                <Stack direction={"row"} spacing={4}>
                                                    <Stack direction={"row"} spacing={2}>
                                                        <LabelValueTypography>Request Amount: </LabelValueTypography>
                                                        <SpanValueTypography>{item.requestAmount.toString()} USDC</SpanValueTypography>
                                                    </Stack>
                                                    <Stack direction={"row"} spacing={2}>
                                                        <LabelValueTypography>Interest Amount: </LabelValueTypography>
                                                        <SpanValueTypography>{item.interest.toString()} USDC</SpanValueTypography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{height: "100%"}}>
                                                {item.orderStatus && item.loanStartTime == "0" && item.borrower.toBase58() == wallet.publicKey.toBase58() ?
                                                    <LoadingButton
                                                        variant={"contained"}
                                                        disabled={loading}
                                                        onClick={() => {
                                                            cancelOrderHandler(item);
                                                        }}>
                                                        Cancel Order
                                                    </LoadingButton> : ''}
                                                {item.orderStatus && item.loanStartTime == "0" && item.borrower.toBase58() != wallet.publicKey.toBase58() ?
                                                    <LoadingButton
                                                        variant={"contained"}
                                                        disabled={loading}
                                                        onClick={() => {
                                                            loanHandler(item);
                                                        }}>
                                                        Give Loan
                                                    </LoadingButton> : ''}

                                                {!item.orderStatus && item.loanStartTime != "0" && item.paidBackAt == "0" && item.withdrewAt == "0" && item.lender.toBase58() == wallet.publicKey.toBase58() ?
                                                    <LoadingButton
                                                        variant={"contained"}
                                                        disabled={loading}
                                                        onClick={() => {
                                                            liquidityHandler(item);
                                                        }}>
                                                        Liquidity
                                                    </LoadingButton> : ''}
                                                {!item.orderStatus && item.loanStartTime != "0" && item.paidBackAt == "0" && item.withdrewAt == "0" && item.borrower.toBase58() == wallet.publicKey.toBase58() ?
                                                    <LoadingButton
                                                        variant={"contained"}
                                                        disabled={loading}
                                                        onClick={() => {
                                                            payBackHandler(item);
                                                        }}>
                                                        PayBack
                                                    </LoadingButton> : ''}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{position: "absolute", top: "10px", right: "10px"}}>
                                        {item.orderStatus && item.loanStartTime == "0" ? <Chip label="New" color="info" size={"small"}/> : ''}
                                        {!item.orderStatus && item.loanStartTime == "0" ? <Chip label="Canceled" size={"small"}/> : ''}
                                        {!item.orderStatus && item.loanStartTime != "0" && item.paidBackAt == "0" && item.withdrewAt == "0" ? <Chip label="Loaning..." color="warning" size={"small"}/> : ''}
                                        {!item.orderStatus && item.paidBackAt != "0" ? <Chip label="Success" color="success" size={"small"}/> : ''}
                                        {!item.orderStatus && item.withdrewAt != "0" ? <Chip label="Liquidate" color="error" size={"small"}/> : ''}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    }
                </Box>
                : (<div>No Orders</div>) : <div>Your wallet did not connected.</div>}

            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleSuccessClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={handleSuccessClose} severity="success" sx={{width: '100%'}}>
                    Success!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleErrorClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={handleErrorClose} severity="error" sx={{width: '100%'}}>
                    Error!
                </Alert>
            </Snackbar>
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
                                let value = parseInt(event.target.value);
                                if (Number.isNaN(value)) {
                                    handleAmountChange(0);
                                } else {
                                    handleAmountChange(value);
                                }
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
                                let value = parseInt(event.target.value);
                                if (Number.isNaN(value)) {
                                    handleInterestChange(0);
                                } else {
                                    handleInterestChange(value);
                                }
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <LoadingButton onClick={createOrderHandler} disabled={creating} loading={creating}>Add Order</LoadingButton>
                    <LoadingButton onClick={handleClose} disabled={creating}>Cancel</LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Home
