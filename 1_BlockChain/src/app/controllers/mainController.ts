import blockChainLib from "../libraries/blockChainLib";

class MainController {

    async mine(req: any, res: any)
    {

        try {

            let prev_block = blockChainLib.getPreviousBlock();
            let prev_proof = prev_block.proof;

            let proof = await blockChainLib.proofOfWork(prev_proof)
            let previous_hash = await blockChainLib.getBlockHash(prev_block)
            
            let block = await blockChainLib.createBlock(proof, previous_hash)

            res.send({
                success: true,
                length: blockChainLib.chain.length,
                block: block,
            });
            return;

        } catch ( e ) {

            res.send({
                success: false,
                error: e.message
            });
            return;

        }

    }

    async getBlockChain(req: any, res: any)
    {

        try {

            res.send({
                success: true,
                length: blockChainLib.chain.length,
                chain: blockChainLib.chain,
            });
            return;

        } catch ( e ) {

            res.send({
                success: false,
                error: e.message
            });
            return;

        }

    }


}

export default new MainController();