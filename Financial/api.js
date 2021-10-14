let DNAChain = require("./network");

const express = require("express");

const rp = require("request-promise");

const app = express();

app.set("port", 2310);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(app.get("port"), () => {
  console.log("Server Runnning");
});

app.post("/user", (req, res) => {
  const { username, password } = req.body;

  let ress = DNAChain.addUser(username, password);

  console.log(DNAChain.users);

  res.send(ress.toString());
});

app.post("/user-alone", (req, res) => {
  const { name, pwd } = req.body;

  const r = DNAChain.addUserNoBoradcast(name, pwd);

  res.send(r);
});

app.get("/schema", (req, res) => {
  const { from, to, amount } = req.body;

  const tx = {
    from: from,

    to: to,

    amount: amount,

    validator: DNAChain.user,
  };

  res.send(tx);
});

app.post("/transaction", async (req, res) => {
  const { from, to, amount, signature } = req.body;

  const tx = {
    from: from,

    to: to,

    amount: amount,

    signature: signature,

    validator: DNAChain.user,
  };

  let r = await DNAChain.addTransaction(tx);

  res.send(r);
});

app.get("/chainHash", (req, res) => {
  res.send(DNAChain.chainHash);
});

app.get("/ip", (req, res) => {
  res.send(req.socket.remoteAddress);
});

app.get("/chain", (req, res) => {
  let ip = req.socket.remoteAddress; //GET IP

  let http = "http://";

  let port = ":2310/";

  if (ip == "::ffff:127.0.0.1" || ip == "::1" || ip == "127.0.0.1") {
    res.send("Invalid IP");
  } else {
    ip = ip.replace("::ffff:", "");

    ip = http + ip + port;

    const verif = DNAChain.nodes.includes(ip);

    if (!verif) {
      let reqs = [];

      DNAChain.nodes.forEach((node) => {
        const options = {
          uri: node + "node",

          method: "POST",

          json: true,

          body: {
            ip: ip,
          },
        };

        reqs.push(rp(options));
      });

      Promise.all(reqs)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log("Error");
        });

      res.send(DNAChain);
      DNAChain.addNode(ip);
    } else {
      DNAChain.addNode(ip);
      res.send(DNAChain);
    }
  }
});

app.post("/node", (req, res) => {
  const { ip } = req.body;

  const verif = DNAChain.nodes.includes(ip);

  if (!verif) {
    const r = DNAChain.addNode(ip);

    res.send(r);
  } else {
    res.send("Already added node");
  }
});

app.get("/balance/:username", (req, res) => {
  const balance = DNAChain.getBalance(req.params.username);

  res.send(balance.toString());
});

app.post("/decode", (req, res) => {
  const { sequence } = req.body;

  res.send(DNAChain.decode(sequence).toString());
});

app.post("/consensus", (req, res) => {
  let { obj, seq, securitySeq, chainHash } = req.body;

  let vote = "";

  let balance = DNAChain.getBalance(obj.from);

  let myHash = DNAChain.getActualHash();

  let validate = DNAChain.validate(seq, securitySeq);

  const signature = obj.signature;

  if (!signature) {
    console.log("No signature");

    res.send("no");
  } else {
    const verify = DNAChain.verifyTransaction(obj);

    console.log(verify);

    if (balance >= obj.amount && myHash == chainHash && validate && verify) {
      vote = "yes";

      res.send(vote);
    } else {
      vote = "no";

      res.send(vote);
    }
  }
});

//TEST Some of this endpoints are dead for security reasons ***********************

app.get("/new-address", (req, res) => {
  res.send(DNAChain.createAddress());
});

app.post("/sign", (req, res) => {
  const { tx, pv } = req.body;

  const signature = DNAChain.signTransaction(tx, pv);

  res.send(signature);
});

app.post("/verify", (req, res) => {
  const { tx } = req.body;

  const verif = DNAChain.verifyTransaction(tx);

  res.send(verif);
});

//****************************************** */

app.post("/add-check", (req, res) => {
  let { obj, seq, securitySeq, chainHash } = req.body;

  let balance = DNAChain.getBalance(obj.from);

  let myHash = DNAChain.getActualHash();

  let validate = DNAChain.validate(seq, securitySeq);

  const signature = obj.signature;

  if (!signature) {
    res.send("No added");
  } else {
    const verify = DNAChain.verifyTransaction(obj);

    if (
      balance >= obj.amount &&
      myHash == chainHash &&
      validate &&
      obj.amount !== 0 &&
      verify
    ) {
      let r = DNAChain.addNoBroadcast(obj);

      res.send(r);
    } else if (
      obj.amount == 0 &&
      DNAChain.currentStrand == 0 &&
      balance >= obj.amount &&
      myHash == chainHash &&
      validate &&
      verify
    ) {
      let r = DNAChain.addNoBroadcast(obj);

      res.send(r);
    } else {
      res.send("No added");
    }
  }
});

//Initialize chain

///Update Chain

let rootNodes = DNAChain.root;

let b = false;

for (var i = 0; i < rootNodes.length; i++) {
  rp(rootNodes[i] + "chain")
    .then((res) => {
      let chainHash = DNAChain.getChainHash();

      if (res == "Invalid IP") {
        console.log(res);

        return;
      }

      if (res !== "Already added node") {
        if (chainHash == JSON.parse(res).chainHash) {
          let json = JSON.parse(res);

          DNAChain.chain = json.chain;

          DNAChain.currentStrand = json.currentStrand;

          DNAChain.chainHash = json.chainHash;

          for (var i = 0; i < json.nodes.length; i++) {
            const currentNode = json.nodes[i];

            const pastNode = json.nodes[i - 1];

            if (currentNode !== pastNode && currentNode !== DNAChain.local) {
              DNAChain.nodes.push(currentNode);
            }
          }

          DNAChain.root = json.root;

          b = true;

          console.log(DNAChain);
        } else {
          console.log("Corrupted copy");
        }
      } else {
        b = true;
        let json = JSON.parse(res);
        DNAChain.currentStrand = json.currentStrand;
        DNAChain.chainHash = json.chainHash;

        json.chain.forEach((strand) => {
          const seq = strand.sequence;
          const sec = strand.securitySequence;

          const valid = DNAChain.validate(seq, sec);

          if (valid) {
            DNAChain.chain = json.chain;
          } else {
            console.log("Invalid chain, try with another node");
          }
        });

        for (var i = 0; i < json.nodes.length; i++) {
          const currentNode = json.nodes[i];

          const pastNode = json.nodes[i - 1];

          console.log(currentNode);

          if (currentNode !== pastNode && currentNode !== DNAChain.local) {
            DNAChain.nodes.push(currentNode);
          }
        }

        DNAChain.root = json.root;

        console.log(DNAChain);
      }
    })
    .catch((e) => {
      console.log(e);
    });

  if (b) {
    break;
  }
}
