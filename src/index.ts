import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: string)
        : string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validate = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" && typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash == "string" && typeof aBlock.timestamp == "number" &&
        typeof aBlock.data === "string";

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number,
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "31023213", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp)
    addBlock(newBlock);
    return newBlock;
}

const getHasforBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isValidBlock = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validate(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHasforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    return true;
}

const addBlock = (candidateBlock: Block): void => {
    if (isValidBlock(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

createNewBlock("hello");
createNewBlock("bye bye");

console.log(getBlockchain());

export { };