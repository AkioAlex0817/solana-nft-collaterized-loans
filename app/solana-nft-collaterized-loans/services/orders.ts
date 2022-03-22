import * as anchor from "@project-serum/anchor";
import {NFT_LOAN_KEY, STABLE_COIN_KEY, USDC_VAULT_KEY} from "../utils/consts";
import {ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";

type GetOrderProps = {
    program: anchor.Program<anchor.Idl>;
    filter?: unknown[];
}

export const getOrders = async ({program, filter = []}: GetOrderProps) => {
    const ordersRaw = await program.account.order.all(filter as any);
    const orders = ordersRaw.map((t: any) => console.log(t));
    return [];
}

type CreateOrder = {
    program: anchor.Program<anchor.Idl>;
    connection: any,
    wallet: any;
    nft: string;
    amount: number;
    interest: number;
    duration: number;
};

export const createOrder = async ({program, connection, wallet, nft, amount, interest, duration}: CreateOrder) => {
    try {
        const fetch = await program.account.cloans.fetch(NFT_LOAN_KEY);
        const nftMintPubKey = new anchor.web3.PublicKey(nft);
        const nftLoanPubKey = new anchor.web3.PublicKey(NFT_LOAN_KEY);
        const stableMintPubKey = new anchor.web3.PublicKey(STABLE_COIN_KEY);
        const stableVaultPubKey = new anchor.web3.PublicKey(USDC_VAULT_KEY);
        const [signer, signerBump] = await anchor.web3.PublicKey.findProgramAddress([nftLoanPubKey.toBuffer()], program.programId);
        const [order, orderBump] = await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from(new anchor.BN(fetch.orderId.toString()).toString()),
                nftLoanPubKey.toBuffer(),
            ],
            program.programId);
        let userUsdc = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            stableMintPubKey,
            wallet.publicKey
        );
        console.log("User USDC Key: ", userUsdc.toString());
        const [nftCoinVault, nftVaultBump] = await anchor.web3.PublicKey.findProgramAddress(
            [
                nftMintPubKey.toBuffer(),
            ],
            program.programId);
        console.log("NFT Vault: ", nftCoinVault.toString());

        console.log("Order: ", order.toString());
        await program.rpc.createOrder(orderBump, new anchor.BN(amount), new anchor.BN(interest), new anchor.BN(duration), new anchor.BN(Math.round(amount / 10)), {
            accounts: {
                cloans: nftLoanPubKey,
                stablecoinMint: stableMintPubKey,
                stablecoinVault: stableVaultPubKey,
                userStablecoinVault : userUsdc,
                nftMint: nftMintPubKey,
                nftVault: nftCoinVault,
                userNftVault: userUsdc,
                order: order,
                borrower: wallet.publicKey,
                signer: signer,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            },
            signers: [wallet]
        });
        return order.toString();
    } catch (error) {
        console.log(error);
        return '';
    }
}


