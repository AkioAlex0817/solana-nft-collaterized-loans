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
    let nftMintObject: Token;

    let alice: anchor.web3.Keypair;
    let aliceStableCoinWallet: anchor.web3.PublicKey;
    let aliceNftWallet: anchor.web3.PublicKey;

    let bob: anchor.web3.Keypair;
    let bobStableCoinWallet: anchor.web3.PublicKey;
    let bobNftWallet: anchor.web3.PublicKey;

    let nftCollaterizedLoansKeyPair: anchor.web3.Keypair;
    let stableCoinVault: anchor.web3.PublicKey;
    let nftCoinVault: anchor.web3.PublicKey;

    let signer: anchor.web3.PublicKey;
    let signerBump: number;

    it('Initialize Program', async () => {
        nftCollaterizedLoansKeyPair = anchor.web3.Keypair.generate()
        // Create StableCoin
        let keyPairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/stablecoin.json', "utf-8");
        let keyPairData = JSON.parse(keyPairFile);
        stableCoinMintKeyPair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keyPairData));
        stableCoinMintObject = await utils.createMint(stableCoinMintKeyPair, provider, provider.wallet.publicKey, null, 0, TOKEN_PROGRAM_ID);
        stableCoinMintPubKey = stableCoinMintObject.publicKey;

        // Load Alice
        let alicePairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/alice.json', "utf-8");
        let alicePairData = JSON.parse(alicePairFile);
        alice = anchor.web3.Keypair.fromSecretKey(new Uint8Array(alicePairData));

        // Airdrop 10 SOL to alice
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                alice.publicKey,
                10000000000
            ),
            "confirmed"
        );

        // Load Bob
        let bobPairFile = fs.readFileSync('/home/alex/blockchain/solana-nft-collaterized-loans/tests/keys/bob.json', "utf-8");
        let bobPairData = JSON.parse(bobPairFile);
        bob = anchor.web3.Keypair.fromSecretKey(new Uint8Array(bobPairData));

        // Airdrop 10 SOL to Bob
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                bob.publicKey,
                10000000000
            ),
            "confirmed"
        );

        //create stable Token wallet for alice and bob
        aliceStableCoinWallet = await stableCoinMintObject.createAssociatedTokenAccount(alice.publicKey);
        bobStableCoinWallet = await stableCoinMintObject.createAssociatedTokenAccount(bob.publicKey);

        //Airdrop StableCoin To Alice
        await utils.mintToAccount(provider, stableCoinMintPubKey, aliceStableCoinWallet, 1000);

        //Airdrop StableCoin To Bob
        await utils.mintToAccount(provider, stableCoinMintPubKey, bobStableCoinWallet, 1000);

        // Create Nft Token
        let mintKeyNft = anchor.web3.Keypair.generate();
        nftMintObject = await utils.createMint(mintKeyNft, provider, provider.wallet.publicKey, null, 0, TOKEN_PROGRAM_ID);
        nftMintPubKey = nftMintObject.publicKey;

        //Create NFT Account for Alice and Bob
        aliceNftWallet = await nftMintObject.createAssociatedTokenAccount(alice.publicKey);
        bobNftWallet = await nftMintObject.createAssociatedTokenAccount(bob.publicKey);
        //Mint Nft Token to alice
        await utils.mintToAccount(provider, nftMintPubKey, aliceNftWallet, 1);

        [signer, signerBump] = await anchor.web3.PublicKey.findProgramAddress([nftCollaterizedLoansKeyPair.publicKey.toBuffer()], program.programId);
        stableCoinVault = await stableCoinMintObject.createAccount(signer);
        nftCoinVault = await nftMintObject.createAccount(signer);

        console.log("Alice: ", alice.publicKey.toString());
        console.log("Bob: ", bob.publicKey.toString());
        assert.strictEqual(await utils.getTokenBalance(provider, aliceStableCoinWallet), 1000);
        assert.strictEqual(await utils.getTokenBalance(provider, bobStableCoinWallet), 1000);
        assert.strictEqual(await utils.getTokenBalance(provider, aliceNftWallet), 1);
        assert.strictEqual(await utils.getTokenBalance(provider, bobNftWallet), 0);
        assert.strictEqual(await utils.getTokenBalance(provider, stableCoinVault), 0);
        assert.strictEqual(await utils.getTokenBalance(provider, nftCoinVault), 0);

        describe('Test Start', () => {
            it("Check initialize", async () => {
                console.log("Initialize Start!");
                await program.rpc.initialize(signerBump, {
                    accounts: {
                        cloans: nftCollaterizedLoansKeyPair.publicKey,
                        stablecoinMint: stableCoinMintPubKey,
                        stablecoinVault: stableCoinVault,
                        signer: signer,
                    },
                    instructions: [
                        await program.account.cloans.createInstruction(nftCollaterizedLoansKeyPair),
                    ],
                    signers: [nftCollaterizedLoansKeyPair]
                });
                console.log("Initialize Success!");

                describe('Main Logic', () => {
                    it("Create Order Logic", async () => {
                        const fetch = await program.account.cloans.fetch(nftCollaterizedLoansKeyPair.publicKey);
                        // Create Order
                        const [order, orderBump] = await anchor.web3.PublicKey.findProgramAddress(
                            [
                                Buffer.from(fetch.orderId.toString()),
                                nftCollaterizedLoansKeyPair.publicKey.toBuffer()
                            ],
                            program.programId);
                        await program.rpc.createOrder(orderBump, new anchor.BN(100), new anchor.BN(10), new anchor.BN(10), new anchor.BN(10), {
                            accounts: {
                                cloans: nftCollaterizedLoansKeyPair.publicKey,
                                stablecoinMint: stableCoinMintPubKey,
                                stablecoinVault: stableCoinVault,
                                userStablecoinVault: aliceStableCoinWallet,
                                nftMint: nftMintPubKey,
                                nftVault: nftCoinVault,
                                userNftVault: aliceNftWallet,
                                order: order,
                                borrower: alice.publicKey,
                                signer: signer,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                tokenProgram: TOKEN_PROGRAM_ID,
                            },
                            signers: [alice]
                        });
                    });
                    it('Cancel Order Login', async () => {
                        const fetch = await program.account.cloans.fetch(nftCollaterizedLoansKeyPair.publicKey);
                        // Create Order
                        const [order, orderBump] = await anchor.web3.PublicKey.findProgramAddress(
                            [
                                Buffer.from(fetch.orderId.toString()),
                                nftCollaterizedLoansKeyPair.publicKey.toBuffer()
                            ],
                            program.programId);
                        await program.rpc.createOrder(orderBump, new anchor.BN(100), new anchor.BN(10), new anchor.BN(10), new anchor.BN(10), {
                            accounts: {
                                cloans: nftCollaterizedLoansKeyPair.publicKey,
                                stablecoinMint: stableCoinMintPubKey,
                                stablecoinVault: stableCoinVault,
                                userStablecoinVault: aliceStableCoinWallet,
                                nftMint: nftMintPubKey,
                                nftVault: nftCoinVault,
                                userNftVault: aliceNftWallet,
                                order: order,
                                borrower: alice.publicKey,
                                signer: signer,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                tokenProgram: TOKEN_PROGRAM_ID,
                            },
                            signers: [alice]
                        });
                        await program.rpc.cancelOrder(fetch.orderId, {
                            accounts: {
                                cloans: nftCollaterizedLoansKeyPair.publicKey,
                                order: order,
                                stablecoinMint: stableCoinMintPubKey,
                                stablecoinVault: stableCoinVault,
                                userStablecoinVault: aliceStableCoinWallet,
                                nftMint: nftMintPubKey,
                                nftVault: nftCoinVault,
                                userNftVault: aliceNftWallet,
                                borrower: alice.publicKey,
                                signer: signer,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                tokenProgram: TOKEN_PROGRAM_ID,
                            },
                            signers: [alice]
                        });
                    })
                });
            });


        })
    });
});
