import {useEffect, useState} from "react";
import {Connection, PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

import idl from "../idl/solana_nft_collaterized_loans.json";

const SOLANA_NFT_COLLATERIZED_LOANS_PROGRAM = '2BgeCAUB7cyShYRN8eeuHM6Ergh9B3xFXjuYTwHu4PPR';
const programID = new PublicKey(SOLANA_NFT_COLLATERIZED_LOANS_PROGRAM);

export interface Wallet {
    signTransaction(
        tx: anchor.web3.Transaction
    ): Promise<anchor.web3.Transaction>;

    signAllTransactions(
        txs: anchor.web3.Transaction[]
    ): Promise<anchor.web3.Transaction[]>;

    publicKey: anchor.web3.PublicKey;
}

type ProgramProps = {
    connection: Connection;
    wallet: Wallet;
}

export const useProgram = ({connection, wallet}: ProgramProps) => {
    const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

    useEffect(() => {
        updateProgram();
    }, [connection, wallet]);

    const updateProgram = () => {
        const provider = new anchor.Provider(connection, wallet, {
            preflightCommitment: "recent",
            commitment: "processed",
        });
        const program = new anchor.Program(idl as any, programID, provider);

        setProgram(program);
    }
    return {
        program,
    };
}