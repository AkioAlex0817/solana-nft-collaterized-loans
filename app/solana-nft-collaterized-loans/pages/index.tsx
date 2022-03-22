import type {NextPage} from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import {useProgram} from "../utils/usePrograms";
import * as anchor from "@project-serum/anchor";
import {getOrders} from "../services/orders";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

const Home: NextPage = () => {
    const wallet: any = useAnchorWallet();
    const [orders, setOrders] = useState<unknown[]>([]);
    const {program} = useProgram({connection, wallet});
    const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

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

    return (
        <Container maxWidth={"xl"}>
            {wallet ? <div>Orders</div> : <div>No orders</div>}
        </Container>
    );
}

export default Home
