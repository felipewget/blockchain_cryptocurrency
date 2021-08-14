import sha256 from "sha256";
import url from 'url'
import axios from 'axios';

import { getUUID } from './../utils/hashUtils'

type blockType = {
    index: number,
    timestamp: number,
    proof:  number,
    previous_hash: string
}

class blockChainLib {

    chain:Array<blockType> = [];
    transactions:Array<any>  = [];
    nodes:Array<any> = [];
    dificulty_level:number = 4;

    constructor()
    {
        this.startChain();
    }

    /**
     * Create Genesis Block
     */
    startChain()
    {
        this.chain = [];
        this.createBlock(1, '0');
    }

    async createBlock(proof:number, prev_hash:string)
    {

        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.transactions,
            proof:  proof,
            previous_hash: prev_hash
        }

        this.transactions = [];

        await this.chain.push(block)

        return block

    }

    getPreviousBlock = () => this.chain[this.chain.length-1]

    async proofOfWork(previous_proof:any)
    {

        let new_proof:number = 1;
        let check_proof = false;

        while(check_proof===false){

            let tmp_hash = sha256((new_proof ** 2 - previous_proof ** 2).toString())
            if( tmp_hash.substr(0,this.dificulty_level).replace(/(0*)/,"") == "" ){
                check_proof = true;
            } else {
                new_proof++;
            }

        }

        return new_proof;

    }

    async getBlockHash(block:any)
    {

        let json_block = JSON.stringify(block);
        return sha256(json_block);

    }

    async checkIsValidChain(chain:Array<blockType>)
    {
        
        let previous_block = chain[0];
        for(let i=1; i<chain.length;i++){
            
            if( chain[i].previous_hash != await this.getBlockHash(previous_block) ){
                return false;
            }
            
            let tmp_hash = sha256((chain[i].proof**2 - previous_block.proof**2).toString())
            if( tmp_hash.substr(0,this.dificulty_level).replace(/(0*)/,"") != "" ){
                return false;
            }

            previous_block = chain[i];

        }

        return true;

    }

    async addTransactions(from:any, to:any, amount:number)
    {

        this.transactions.push({
            from: from,
            to: to,
            amount: amount
        })

        let previous_block = this.getPreviousBlock()

        return (previous_block.index + 1 )

    }

    async addNode(address:string)
    {
        
        let parsed_url = url.parse(address)
        if( this.nodes.indexOf(parsed_url.host) < 0 ){
            this.nodes.push(parsed_url.host);
        }

    }

    async replaceChain()
    {

        // Pego a blockchain mais longa
        let longest_chain = null; // this.chain;
        let max_length = this.chain.length

        // Percorro os outros server pra validação
        for( let i in this.nodes ){
            
            let { status, data } = await axios.get(`http://${this.nodes[i]}/block`);

            if(status == 200){

                let response = data
                let num_blocks = response['length']
                
                if( num_blocks > max_length && this.checkIsValidChain(response.chain) ){
                    max_length = num_blocks
                    longest_chain = response.chain;
                }

            }

        }

        // Verifico se em uma maiors
        if(longest_chain){
            this.chain = longest_chain;
            return true;
        } else {
            return false;
        }

    }

}

export default new blockChainLib();