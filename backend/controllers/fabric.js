const SHA256 = require('crypto-js/sha256');

class Block
{
  constructor(index,timestamp,data, previousHash = '')
  {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash()
  {
    //crypto.createHash('sha256').update(req.body.cnicNumber).digest('hex')});
    return SHA256(this.index + this.previousHash + this.stimestamp + JSON.stringify(this.data)).toString();
  }
  //end
}

class Blockchain
{
  constructor()
  {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock()
  {
    return new Block(0,"01/01/2021","Genesis Block","0");
  }

  getLatestBlock()
  {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock)
  {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid()
  {
    for (let i= 1; i<this.chain.length; i++)
    {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash())
      {
        return false;
      }
      if(currentBlock.previousHash !== previousBlock.hash)
      {
        return false;
      }
      return true;
    }
  }



  //end
}

let fabriccar = new Blockchain();
fabriccar.addBlock(new Block(1, "10/07/2021",{amount:14000,color:'red'}));
fabriccar.addBlock(new Block(2, "15/07/2021",{amount:25000,color:'white'}));

//console.log(JSON.stringify(fabriccar,null,4));
console.log("Is blockcain valid? : " +fabriccar.isChainValid());


fabriccar.chain[1].data = {amount:54000};


console.log("Is blockcain valid? : " +fabriccar.isChainValid());

