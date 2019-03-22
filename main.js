////////////////////////////////////////////////////
///                                             ///
///   MUHAMMAD ADIP KOLILI                      ///
///                                             ///
///////////////////////////////////////////////////

const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress= fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }
}

class Block{
    constructor(timestamp, transactions, previousHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); //saat membuat block,akan di kalkulasi hash
        this.nonce= 0;
    }



    calculateHash(){
        return SHA256(this.index + this.previousHash+ this.timestamp + JSON.stringify(this.data) +this.nonce).toString();
    }

    mineBlock(difficulty){ //method
        while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join("0")){ //agar tetap mencari atau berjalan sampai
            this.nonce++;
            this.hash=this.calculateHash();
        }
        
        console.log("Block Mined : "+ this.hash) ///print hash yg sudah di mined
    }
}
//mining process
class Blockchain {
    constructor(){
       this.chain = [this.createGenesisBlock()]; //array dari blok
       this.difficulty=2; //tingkat kesulitan hash
       this.pendingTransactions = [];
       this.miningReward = 100;

    }
    createGenesisBlock(){ //methodmembuat genesis blok
        return new Block("01/01/2019","Genesis block","0");

    }

    getLatestBlock(){ //method untuk mendapatkan block
        return this.chain[this.chain.length-1]; //mengembalikan block terakhir pada chain
    }

    minePendingTransactions(miningRewardAddress){
        //if succes sending reward
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully mined!');
        this.chain.push(block);
        //reset pending trans array and create new transaction and give miner reward
        this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }
    //addBlock(newBlock){ //pada method ini untuk menambah block baru
       // newBlock.previousHash = this.getLatestBlock().hash; //set previus hash blok baru dengan hash block sebelumnya
        ////newBlock.hash = newBlock.calculateHash(); // Hash pada block baru di buat
        //newBlock.mineBlock(this.difficulty);
       // this.chain.push(newBlock); //Masukkan block ke chain
    //}
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);

    }
    //method check the balance of the address
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    isChainValid(){ //verified block
        for(let i=1; i<this.chain.length; i++){ //karena 0 adalah genesis block
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()){ //mengecek block telah terlink
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){ //cek hash blok sebelumnya pada current sama dgn hash pada hach sebelumnya
                return false;
            }

        }
        return true;
    }
}

let swaxticBlock = new Blockchain();
//console.log('Mining block 1....');
//swaxticBlock.addBlock(new Block(1,"10/07/2019",{amount : 4}));

//console.log('Mining block 2....');
//swaxticBlock.addBlock(new Block(2,"12/07/2019",{amount : 10}));
//console.log(JSON.stringify(swaxticBlock,null, 4));
//console.log('Is Blockchain valid?'+swaxticBlock.isChainValid());

swaxticBlock.createTransaction(new Transaction('address1','address2',100));
swaxticBlock.createTransaction(new Transaction('address2','address1',50));

console.log('\n Starting the miner...');
swaxticBlock.minePendingTransactions('javi-address');

console.log('\n Balance of javi is',swaxticBlock.getBalanceOfAddress('javi-address'));

console.log('\n Starting the miner again again...');
swaxticBlock.minePendingTransactions('javi-address');

console.log('\n Balance of javi is',swaxticBlock.getBalanceOfAddress('javi-address'));

