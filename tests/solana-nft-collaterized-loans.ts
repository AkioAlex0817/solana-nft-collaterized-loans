import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {SolanaNftCollaterizedLoans} from "../target/types/solana_nft_collaterized_loans";
import {Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";

const utils = require('./utils');
import * as fs from "fs";
import {exit} from "process";
import * as assert from "assert";

const provider = anchor.Provider.env();
anchor.setProvider(provider);

const program = anchor.workspace.SolanaNftCollaterizedLoans as Program<SolanaNftCollaterizedLoans>;

describe("solana-nft-collaterized-loans", () => {

    let stableCoinMintKeyPair: anchor.web3.Keypair;
    let stableCoinMintObject: Token;
    let stableCoinMintPubKey: anchor.web3.PublicKey;

    let nftMintPubKey: anchor.web3.PublicKey;


    let alice: anchor.web3.PublicKey;
    let aliceStableCoinWallet: anchor.web3.PublicKey;
    let aliceNftWallet: anchor.web3.PublicKey;

    let bob: anchor.web3.PublicKey;
    let bobStableCoinWallet: anchor.web3.PublicKey;
    let bobNftWallet: anchor.web3.PublicKey;

    let nftCollaterizedLoans: anchor.web3.Keypair = anchor.web3.Keypair.generate();

    it('Prepare', async () => {
        // Create StableCoin
        let keyPairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/stablecoin.json', "utf-8");
        let keyPairData = JSON.parse(keyPairFile);
        stableCoinMintKeyPair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keyPairData));
        stableCoinMintObject = await utils.createMint(stableCoinMintKeyPair, provider, provider.wallet.publicKey, null, 0, TOKEN_PROGRAM_ID);
        stableCoinMintPubKey = stableCoinMintObject.publicKey;

        // Load Alice
        let alicePairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/alice.json', "utf-8");
        let alicePairData = JSON.parse(alicePairFile);
        alice = anchor.web3.Keypair.fromSecretKey(new Uint8Array(alicePairData)).publicKey;
        console.log("Alice: ", alice.toString());

        // Load Bob
        let bobPairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/bob.json', "utf-8");
        let bobPairData = JSON.parse(bobPairFile);
        bob = anchor.web3.Keypair.fromSecretKey(new Uint8Array(bobPairData)).publicKey;
        console.log("Bob: ", bob.toString());

        //create stable Token wallet for alice and bob
        aliceStableCoinWallet = await stableCoinMintObject.createAssociatedTokenAccount(alice);
        bobStableCoinWallet = await stableCoinMintObject.createAssociatedTokenAccount(bob);

        assert.strictEqual(await utils.getTokenBalance(provider, aliceStableCoinWallet), 0);
        assert.strictEqual(await utils.getTokenBalance(provider, bobStableCoinWallet), 0);

        //Airdrop StableCoin To Bob
        await utils.mintToAccount(provider, stableCoinMintPubKey, bobStableCoinWallet, 1000);
        assert.strictEqual(await utils.getTokenBalance(provider, bobStableCoinWallet), 1000);

        // Create Nft Token
        let mintKeyNft = anchor.web3.Keypair.generate();
        let nftMintObject = await utils.createMint(mintKeyNft, provider, provider.wallet.publicKey, null, 0, TOKEN_PROGRAM_ID);
        nftMintPubKey = nftMintObject.publicKey;

        //Mint Nft Token to alice
        aliceNftWallet = await nftMintObject.createAssociatedTokenAccount(alice);
        await utils.mintToAccount(provider, nftMintPubKey, aliceNftWallet, 1);
        assert.strictEqual(await utils.getTokenBalance(provider, aliceNftWallet), 1);

        const [signer, signerBump] = await anchor.web3.PublicKey.findProgramAddress([nftCollaterizedLoans.publicKey.toBuffer()], program.programId);

        const stableCoinVault = await stableCoinMintObject.createAccount(signer);
        assert.strictEqual(await utils.getTokenBalance(provider, stableCoinVault), 0);
        console.log("Initialize Start!");
        await program.rpc.initialize(signerBump, {
            accounts: {
                nftCollaterizedLoans: nftCollaterizedLoans.publicKey,
                stablecoinMint: stableCoinMintPubKey,
                stablecoinVault: stableCoinVault,
                signer: signer,
            },
            instructions: [
                await program.account.nftCollaterizedLoans.createInstruction(nftCollaterizedLoans),
            ],
            signers: [nftCollaterizedLoans]
        });
        console.log("Initialize Success!");
        /*const testValue = await provider.connection.getAccountInfo(nftCollaterizedLoans.publicKey);
        console.log(testValue.data);*/
        const testValue1 = await program.account.nftCollaterizedLoans.fetch(nftCollaterizedLoans.publicKey);
        console.log(testValue1);
        //console.log("Fetch success", testValue.length.toString());
        /*console.log(testValue.stablecoinVault.toString());
        console.log(testValue.orderId.toString());
        console.log(testValue.totalAdditionalCollateral.toString());
        console.log(testValue.nonce.toString());*/
    });

    // it("Initialized!", async () => {
    //     // Create nftCollaterizedLoans
    //     /*const nft = anchor.web3.Keypair.generate();
    //
    //
    //     await program.rpc.initialize(vaultNonce, {
    //         accounts: {
    //             nftCollaterizedLoans: ,
    //             stablecoinMint: stableCoinMintPubKey,
    //             stablecoinVault: stableCoinVault,
    //             signer: provider.wallet.publicKey,
    //             systemProgram: anchor.web3.SystemProgram.programId,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //         }
    //     });*/
    // });
    /*it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.rpc.initialize({});
        console.log("Your transaction signature", tx);
    });*/
});
