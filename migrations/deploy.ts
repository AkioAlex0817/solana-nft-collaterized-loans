// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import {Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {Program} from "@project-serum/anchor";
import {SolanaNftCollaterizedLoans} from "../target/types/solana_nft_collaterized_loans";

const anchor = require("@project-serum/anchor");

module.exports = async function (provider) {
    // Configure client to use the provider.Solana
    anchor.setProvider(provider);

    // Add your deploy script here.

    const program = anchor.workspace.SolanaNftCollaterizedLoans as Program<SolanaNftCollaterizedLoans>;

    const USDC_MINT_KEY = 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';

    let usdcPubkey = anchor.web3.PublicKey(USDC_MINT_KEY);

    let nftCollaterizedLoansKeyPair = anchor.web3.Keypair.generate();

    const [signer, signerBump] = await anchor.web3.PublicKey.findProgramAddress([nftCollaterizedLoansKeyPair.publicKey.toBuffer()], program.programId);

    const stableTokenObject = new Token(
        provider.connection,
        usdcPubkey,
        TOKEN_PROGRAM_ID,
        provider.wallet.payer,
    );

    let stableVault = await stableTokenObject.createAccount(signer);

    const tx = await program.rpc.initialize(signerBump, {
        accounts: {
            cloans: nftCollaterizedLoansKeyPair.publicKey,
            stablecoinMint: usdcPubkey,
            stablecoinVault: stableVault,
            signer: signer,
        },
        instructions: [
            await program.account.cloans.createInstruction(nftCollaterizedLoansKeyPair),
        ],
        signers: [nftCollaterizedLoansKeyPair]
    });

    console.log("Summary Account:", signer.toString());
    console.log("Tx: ", tx);
};
