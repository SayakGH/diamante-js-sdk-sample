import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Event from '../models/eventSchema.js';
import User from "../models/userSchema.js"
import {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks
} from 'diamante-base';
import { Horizon } from 'diamante-sdk-js';
import User from '../models/userSchema.js';

export const createEvent = async (req, res)=>{
    const { Eventname,organizer} = req.body;//organizer will contain the callers id
    const event = new Event({
        Eventname,
        organizer,
        Code: ''
    })
    const user = new User.findById({id:organizer});
    if(user){
        user.organizer=Eventname;
    }

    event.Code= generateRandomSequence(5);

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
}

function generateRandomSequence(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const joinEvent = async (req, res)=>{
    const { name,code} = req.body;//organizer will contain the callers id
    
    const event = new Event.findOne({Code:code});
    if(event){
        try{
        const user =new User.findOne({name:name});
        const creator =  new User.findOne({organizer:event.name});
        
        if(user){
            user.participating=name;
        }
        const amount = 1;

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(creator.secret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: user.publicKey,
                asset: Asset.native(),
                amount: amount,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        }
        catch{
            res.send({ message: "transacton failed" });
        }
    }
    else{
        res.send({ message: 'event does not exist' });
    }
}

export const deleteEvent = async (req, res)=>{
    const { name} = req.body;//organizer will contain the callers id
    await User.updateMany(
        { participating: name }, // Filter to match documents with the specific value
        { $set: { participating: null } }  // Update operation to set 'participating' to null
      );

    await User.updateMany(
        { organising: name }, // Filter to match documents with the specific value
        { $set: { organising: null } }  // Update operation to set 'participating' to null
      );

    const event = new Event.findOne({name:name});
   
        try{
         await event.delete();
        }
        catch{
            res.send({ message: "could not delete data" });
        }
    
}

