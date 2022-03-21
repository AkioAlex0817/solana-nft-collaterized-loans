import type {NextPage} from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useState} from "react";

const Home: NextPage = () => {
    const wallet: any = useAnchorWallet();
    const [orders, setOrders] = useState<unknown[]>([]);
    const { program } = useProgram({ connection, wallet });
    return (
        <Container maxWidth={"xl"}>

        </Container>
    );
}

export default Home
