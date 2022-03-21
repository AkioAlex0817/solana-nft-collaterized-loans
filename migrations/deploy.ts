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
    const NFT_LOAN_SECRET_KEY = '[116,156,99,69,45,49,181,32,228,186,107,154,18,55,36,197,227,252,29,187,108,26,189,136,141,51,114,151,185,174,214,252,253,95,35,0,198,211,183,83,109,245,95,55,8,78,148,195,226,236,148,193,12,191,36,24,86,192,185,76,241,228,144,166]';
    const NFT_LOAN_PUBLIC_KEY = 'c';
    const USDC_VAULT_KEY = 'G6i1PY47JuS1AWrQecWLHtDas8boxrhtKqjskFL2oeTv';

    let nftLoansKeyPair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(NFT_LOAN_SECRET_KEY)));

    /*let usdcPubkey = new anchor.web3.PublicKey(USDC_MINT_KEY);
    const [signer, signerBump] = await anchor.web3.PublicKey.findProgramAddress([nftLoansKeyPair.publicKey.toBuffer()], program.programId);
    /!*const stableTokenObject = new Token(
        provider.connection,
        usdcPubkey,
        TOKEN_PROGRAM_ID,
        provider.wallet.payer,
    );*!/
    let stableVault = new anchor.web3.PublicKey(USDC_VAULT_KEY);

    const tx = await program.rpc.initialize(signerBump, {
        accounts: {
            cloans: nftLoansKeyPair.publicKey,
            stablecoinMint: usdcPubkey,
            stablecoinVault: stableVault,
            signer: signer,
        },
        instructions: [
            await program.account.cloans.createInstruction(nftLoansKeyPair, program.account.cloans.size),
        ],
        signers: [nftLoansKeyPair]
    });

    console.log(tx);*/

    const fetch = await program.account.cloans.fetch(nftLoansKeyPair.publicKey);
    console.log(fetch);
};
