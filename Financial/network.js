let Encoder = require("../Encoder/encoder");
let Decoder = require("../Decoder/decoder");
let Validator = require("../Validator/validator");
let SHA256 = require("crypto-js/sha256");
let encoder = new Encoder();
let decoder = new Decoder();
let validator = new Validator();
var EC = require('elliptic').ec;
let rp = require("request-promise");
var ec = new EC('secp256k1');



class chain{
    constructor(){
        this.chain=[];
        this.currentStrand=0;
        this.chainHash = this.getChainHash();
        this.nodes = [];
        this.validations = 1;
        this.root = ["http://192.168.1.103:2310/"];
        this.user = "043972692985947a4165b4d95ae23710f9e8974f5192589f787daf5d44f03a8bd9aa3e486c3478d6bc09bb3cfe322992061da7466bfe99b431b2b7adf4b50338e7";
        this.local = "http://192.168.1.100:2310/"
    }

    updateValidations(){
        this.validations = this.nodes.length / 2 + 1
    }
    
    calculateHash(data){
        return SHA256(data).toString();
    }

    createAddress(){
       
        var key = ec.genKeyPair();

        let privk = key.getPrivate("hex");
        let publick = key.getPublic("hex");

        return {
            "privateKey" : privk,
            "publicKey" : publick
        }
    }


    verifyTransaction(tx){

        let key = ec.keyFromPublic(tx.from, "hex");

    

        const verif = key.verify(this.calculateHash(tx), tx.signature);



        return verif;
    }

    decode(sequence){
        return decoder.decode(sequence)
    }

    validate(seq, securitySeq){
        const valid = validator.validate(seq, securitySeq);

        return valid
    }

    addNode(ip){
        this.nodes.push(ip)

        return "OK"
    }

    broadcastNode(ip){
        let requests=[];

        for(var i=0; i<this.nodes.length; i++){
            let node = this.nodes[i];
            

            let options = {
                "uri" : node+"node",
                "method" : "POST",
                "json" : true,
                "body" : {
                    "ip" : ip
                }
            }

            requests.push(rp(options));
        }

        Promise.all(requests).then(res => {
            console.log("Added succesfully")
        }).catch(e => {
            console.log("Error")
        })

        return "OK"
    }

    addUserNoBoradcast(name, pwd){
        let hash = SHA256(name+pwd).toString();


        
        let verify = this.users[name];

        if(verify){
            return "Choose another name"
        }else{
            this.users[name] = hash;

            return hash;
        }
    }

    addUser(name, pwd){
        let hash = SHA256(name+pwd).toString();
        let reqs = [];

        
        let verify = this.users[name];

        if(verify){
            return "Choose another name"
        }else{
            this.users[name] = hash;

            this.nodes.forEach(node => {
                const options = {
                    uri: node+"user-alone",
                    method: "POST",
                    json: true,
                    body: {
                        name: name,
                        pwd: pwd
                    }
                }

                reqs.push(rp(options))
            })

            Promise.all(reqs).then(res => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })

            return hash;
        }
    }

   async consensus(obj, seq, securitySeq){
        let requests = [];
        let votes = [];
        let counter = 0;

        for(var i=0; i<this.validations; i++){
            let node = Math.random() * (this.nodes.length-1-0+1) + 0

            if(node > 0 && node < 1){
                node = 0
            }

            console.log(this.nodes)

            const options = {
                uri : this.nodes[node]+"consensus",
                method : "POST",
                json: true,
                body: {
                    obj: obj,
                    seq: seq,
                    securitySeq: securitySeq,
                    chainHash : this.chainHash
                }
            }

          await rp(options).then(res => {
                console.log(res)
                votes.push(res)
            }).catch(e => {
                console.log("Error")
            })
            
        }

       console.log(votes)

        votes.forEach(vote => {
            console.log("gjfgijfdg"+vote)
            if(vote=="yes"){
                counter++;
            }
        })

        if(counter>this.validations/2){
            console.log("YES")
            return true;
        }else{
            console.log(counter)
            return false;
        }

    }

    addNoBroadcast(obj){
      //obj needs to be an string
      let parsed = obj
         
      let sequence = encoder.encode(JSON.stringify(obj));
      let securitySequence = encoder.generateSecurity(sequence);
      let balance = this.getBalance(obj.from);
      const signature = obj.signature;

      if(!signature){
          return "Transaction needs to be signed"
      }else{
          const verify = this.verifyTransaction(obj);

          if(!verify){
              return "Incorrect signature"
          }
      }


  
          if(balance<obj.amount){
              return "You dont have enough funds"
          }

          if(obj.amount=="0" && this.currentStrand!==0){
            return "The transaction value has to be greater than 0"
        }

   

      if(this.currentStrand==0){

          let newStrand = {
              "sequence" : sequence,
              "securitySequence" : securitySequence,
              "prevHash" : "",
              "hash" : this.calculateHash(sequence+securitySequence) 
          }

          const consensus = this.consensus(obj, sequence, securitySequence);

          if(!consensus){
              return "Invalid transaction"
          }

          this.chain.push(newStrand)
         

          let newStrandd = {
              "sequence" : "",
              "securitySequence" : "",
              "prevHash" : newStrand.hash,
              "hash" : "" 
          }

          this.chain.push(newStrandd)

          this.currentStrand++;
          this.chainHash=this.getChainHash();

          this.updateValidations();

          return {
              "sequence" : sequence,
              "securitySequence" : securitySequence,
              "strand" : this.currentStrand
          }
      }else{

          const consensus = this.consensus(obj, sequence, securitySequence);

          if(!consensus){
              return "Invalid transaction"
          }

        
   

          let seq = this.chain[this.currentStrand].sequence;

          let l = seq.length


          if(l>=5000){

              this.chain[this.currentStrand].hash=this.calculateHash(this.chain[this.currentStrand].prevHash+this.chain[this.currentStrand].sequence+this.chain[this.currentStrand].securitySequence)

             

              let newStrand = {
                  "sequence" : "",
                  "securitySequence" : "",
                  "prevHash" : this.chain[this.currentStrand].hash,
                  "hash" : "" 
              }
  
              this.chain.push(newStrand)
  
              this.currentStrand++;
              this.chainHash=this.getChainHash();
          }

          this.chain[this.currentStrand].sequence+=sequence;
          this.chain[this.currentStrand].securitySequence+=securitySequence;
          this.chainHash=this.getChainHash();

    

          
      }

      this.updateValidations();
      
      return {
          "sequence" : sequence,
          "securitySequence" : securitySequence,
          "strand" : this.currentStrand
      }
     
  }

   async addTransaction(obj){

        //obj needs to be an string

        let parsed = obj
         
        let sequence = encoder.encode(JSON.stringify(obj));
        let securitySequence = encoder.generateSecurity(sequence);

        let balance = this.getBalance(obj.from);

        console.log(obj)

        const signature = obj.signature;

        if(!signature){
            return "Transaction needs to be signed"
        }else{
            const verify = this.verifyTransaction(obj);

            if(!verify){
                return "Incorrect signature"
            }
        }

     
    
            if(balance<obj.amount){
                return "You dont have enough funds"
            }
        
        
            if(obj.amount=="0" && this.currentStrand!==0){
                return "The transaction value has to be greater than 0"
            }

     

        if(this.currentStrand==0){

            let newStrand = {
                "sequence" : sequence,
                "securitySequence" : securitySequence,
                "prevHash" : "",
                "hash" : this.calculateHash(sequence+securitySequence) 
            }

            const consensus = await this.consensus(obj, sequence, securitySequence);


            console.log(consensus)

            if(!consensus){
                return "Invalid transaction"
            }

            this.chain.push(newStrand)
           

            let newStrandd = {
                "sequence" : "",
                "securitySequence" : "",
                "prevHash" : newStrand.hash,
                "hash" : "" 
            }

            this.chain.push(newStrandd)

            this.currentStrand++;

            let reqs = [];

            this.nodes.forEach(node => {

                console.log(node)

                const options = {
                    uri: node+"add-check",
                    json: true,
                    method: "POST",
                    body: {
                        obj: obj,
                        seq: sequence,
                        securitySeq: securitySequence,
                        chainHash : this.chainHash
                    }
                }

                reqs.push(rp(options));
            })

            Promise.all(reqs).then(res => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })
     
           

            this.updateValidations();

            return {
                "sequence" : sequence,
                "securitySequence" : securitySequence,
                "strand" : this.currentStrand
            }
        }else{

            const consensus = await this.consensus(obj, sequence, securitySequence);

            console.log(consensus);
            console.log("PAN");

            if(!consensus){
                return "Invalid transaction"
            }

            let reqs = [];

            this.nodes.forEach(node => {
                const options = {
                    uri: node+"add-check",
                    json: true,
                    method: "POST",
                    body: {
                        obj: obj,
                        seq: sequence,
                        securitySeq: securitySequence,
                        chainHash : this.chainHash
                    }
                }

                reqs.push(rp(options));
            })

            Promise.all(reqs).then(res => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })
     

            let seq = this.chain[this.currentStrand].sequence;

            let l = seq.length


            if(l>=5000){

                this.chain[this.currentStrand].hash=this.calculateHash(this.chain[this.currentStrand].prevHash+this.chain[this.currentStrand].sequence+this.chain[this.currentStrand].securitySequence)

               

                let newStrand = {
                    "sequence" : "",
                    "securitySequence" : "",
                    "prevHash" : this.chain[this.currentStrand].hash,
                    "hash" : "" 
                }
    
                this.chain.push(newStrand)
    
                this.currentStrand++;
                this.chainHash=this.getChainHash();
            }

            this.chain[this.currentStrand].sequence+=sequence;
            this.chain[this.currentStrand].securitySequence+=securitySequence;
            this.chainHash=this.getChainHash();

            //Make Coinbase transaction

      

            
        }


        this.updateValidations();

        return {
            "sequence" : sequence,
            "securitySequence" : securitySequence,
            "strand" : this.currentStrand
        }
       
    }

    getBalance(user){

        let b = true;
        let balance = 0.0;

        for(var i=0; i<this.chain.length; i++){
            const strand = this.chain[i];

          

            let valid = validator.validate(strand.sequence, strand.securitySequence);

       
            if(valid){


                let decoded = decoder.decode(strand.sequence);

                console.log(decoded)

       

                for(var j=0; j<decoded.length; j++){
                    const tx = decoded[j];
                    const parts = tx.split(" ")
                    const emitter = parts[0];
                    const amount = parseFloat(parts[1], 10);
                    const receiver = parts[2];
                    const validator = parts[4];

                    if(emitter==user.toUpperCase()){
                        console.log("-"+amount)
                        balance-=amount
                    }

                    if(validator==user.toUpperCase()){
                        console.log("+"+0.4)
                        balance+=0.4;
                    }

                    if(receiver==user.toUpperCase()){
                        console.log("+"+amount)
                        balance+=amount
                    }
                    
               
                }

            }else{
                b = false;
            }
        }


        if(b){
            return balance
        }else{
            return "Corrupted Chain"
        }
    }

    getChainHash(){
        return this.calculateHash(this.chain, this.currentStrand);
    }

    getActualHash(){
        return this.chainHash;
    }

    validateUser(user, pwd){
        let userr = this.users[user];

        if(!userr){
            return "No user with that name"
        }else{
            let hash = SHA256(user+pwd).toString();;

            if(hash==userr){
                return "OK"
            }else{
                return "Incorrect password"
            }
        }
    }

    
    
}



const DNAchain = new chain();

module.exports = DNAchain;

