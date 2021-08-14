import sha256 from "sha256";

type blockType = {
    index: number,
    timestamp: number,
    proof:  number,
    previous_hash: string
}

class blockChainLib {

    chain:Array<blockType> = [];
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
            proof:  proof,
            previous_hash: prev_hash
        }

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

    async checkIsValidChain()
    {
        
        let previous_block = this.chain[0];
        for(let i=1; i<this.chain.length;i++){
            
            if( this.chain[i].previous_hash != await this.getBlockHash(previous_block) ){
                return false;
            }
            
            let tmp_hash = sha256((this.chain[i].proof**2 - previous_block.proof**2).toString())
            if( tmp_hash.substr(0,this.dificulty_level).replace(/(0*)/,"") != "" ){
                return false;
            }

            previous_block = this.chain[i];

        }

        return true;

    }

}

export default new blockChainLib();