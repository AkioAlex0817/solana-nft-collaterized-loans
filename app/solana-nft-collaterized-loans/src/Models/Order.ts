import * as anchor from "@project-serum/anchor";

export class Order {
    orderId: anchor.BN;
    borrower: anchor.web3.PublicKey;
    stablecoinVault: anchor.web3.PublicKey;
    nftMint: anchor.web3.PublicKey;
    nftVault: anchor.web3.PublicKey;
    requestAmount: anchor.BN;
    interest: anchor.BN;
    period: anchor.BN;
    additionalCollateral: anchor.BN;
    lender: anchor.web3.PublicKey;
    createdAt: anchor.BN;
    loanStartTime: anchor.BN;
    paidBackAt: anchor.BN;
    withdrewAt: anchor.BN;
    orderStatus: boolean;
    nonce: anchor.BN;

    constructor(
        orderId: anchor.BN,
        borrower: anchor.web3.PublicKey,
        stablecoinVault: anchor.web3.PublicKey,
        nftMint: anchor.web3.PublicKey,
        nftVault: anchor.web3.PublicKey,
        requestAmount: anchor.BN,
        interest: anchor.BN,
        period: anchor.BN,
        additionalCollateral: anchor.BN,
        lender: anchor.web3.PublicKey,
        createdAt: anchor.BN,
        loanStartTime: anchor.BN,
        paidBackAt: anchor.BN,
        withdrewAt: anchor.BN,
        orderStatus: boolean,
        nonce: anchor.BN,
    ) {
        this.orderId = orderId;
        this.borrower = borrower;
        this.stablecoinVault = stablecoinVault;
        this.nftMint = nftMint;
        this.nftVault = nftVault;
        this.requestAmount = requestAmount;
        this.interest = interest;
        this.period = period;
        this.additionalCollateral = additionalCollateral;
        this.lender = lender;
        this.createdAt = createdAt;
        this.loanStartTime = loanStartTime;
        this.paidBackAt = paidBackAt;
        this.withdrewAt = withdrewAt;
        this.orderStatus = orderStatus;
        this.nonce = nonce;
    }
}