import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";

import {Order} from "../src/Models/Order";

type GetOrderProps = {
    program: anchor.Program<anchor.Idl>;
    filter?: unknown[];
}

export const getTweets = async ({program, filter = []} : GetOrderProps) => {
    const ordersRaw = await program.account.order.all(filter as any);
    const orders = ordersRaw.map((t: any) => console.log(t));
    return [];
}

type CreateOrder = {
    wallet: any;
    requestAmount: number;
    interestAmount: number;
    duration: number;
};

export const createOrder = async({wallet, requestAmount, interestAmount, duration} : CreateOrder) => {
    /*const orderId = 0;
    const [order, orderBump] = await anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from(new anchor.BN(orderId).toString()),

        ]
    )*/

}


