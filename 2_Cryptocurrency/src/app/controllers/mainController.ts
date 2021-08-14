import blockChainLib from "../libraries/blockChainLib";
import { getUUID } from "../utils/hashUtils";

const node_address = getUUID();

class MainController {

    async mine(req: any, res: any)
    {

        try {

            let prev_block = blockChainLib.getPreviousBlock();
            let prev_proof = prev_block.proof;

            let proof = await blockChainLib.proofOfWork(prev_proof)
            let previous_hash = await blockChainLib.getBlockHash(prev_block)
            
            blockChainLib.addTransactions(node_address, 'Exemplo de noe', 1.99);

            let block:any = await blockChainLib.createBlock(proof, previous_hash)

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

    async addTransaction(req: any, res: any)
    {

        let { sender, reciver, amount } = req.query.sender
            ? req.query
            : req.body

        // @TODO add middleware

        let index = await blockChainLib.addTransactions(sender, reciver, amount);

        res.send({
            success: true,
            message: "Transação adicionada ao bloco " + index
        });
        return;

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

    async connectNode(req: any, res: any)
    {

        try {

            let { nodes } = req.query.nodes
                ? req.query
                : req.body

            if( nodes && nodes.length > 0 ){

                for( let i in nodes ){
                    blockChainLib.addNode( nodes[i] );
                }

                res.send({
                    success: true,
                    total_nodes: blockChainLib.nodes.length,
                    nodes: blockChainLib.nodes
                });
                return;

            } else {

                res.send({
                    success: false,
                    error: "Não há nodes"
                });
                return;

            }

        } catch ( e ) {

            res.send({
                success: false,
                error: e.message
            });
            return;

        }

    }

    async replaceChain(req: any, res: any)
    {

        let is_chain_replaced = await blockChainLib.replaceChain();

        res.send({
            success: true,
            replaced: is_chain_replaced,
            chain: blockChainLib.chain
        });
        return;

    }

}

export default new MainController();