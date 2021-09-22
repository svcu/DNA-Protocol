class encoder{



    encode(object){
        
        let alphabet = {"A":1, "B":2, "C":3, "D":4, "E":5, "F":6, "G":7, "H":8, "I":9, "J":10, "K":11, "L":12, "M":13, "N":14, "O":15, "P":16, "Q":17, "R":18, "S":19, "T":20, "U":21, "V":22, "W":23, "X":24, "Y":25, "Z":26, ".":27}

        let encodedStrand="T";
       


        let json = JSON.parse(object)

        console.log(json)

        let from = json.from;
        let to = json.to;
        let amount = json.amount;
        let validator = json.validator;
        let timestap = Date.now();

        for(let c of from){
            
            
            let number = alphabet[c.toUpperCase()]

            if(number){
                for (var i=0; i<number; i++){
                    encodedStrand+="C"
                }
    
                encodedStrand+="A"
            }else{
                encodedStrand+=c;
                encodedStrand+="A"
            }

        
        }

        encodedStrand+="U";
        encodedStrand+=amount;
        encodedStrand+="U";
        encodedStrand+="A";
        

        for(let c of to){
            let number = alphabet[c.toUpperCase()]

        
            if(number){
                for (var i=0; i<number; i++){
                    encodedStrand+="C"
                }
    
                encodedStrand+="A"
            }else{
                encodedStrand+=c;
                encodedStrand+="A"
            }
        }



        encodedStrand+="U";
        encodedStrand+=timestap;
        encodedStrand+="U";

        for(let c of validator){
            let number = alphabet[c.toUpperCase()]

        

            if(number){
                for (var i=0; i<number; i++){
                    encodedStrand+="C"
                }
    
                encodedStrand+="A"
            }else{
                encodedStrand+=c;
                encodedStrand+="A"
            }
        }

        encodedStrand+="G"


        return encodedStrand;
    }

    generateSecurity(strand){
        let securityStrand = "";

        for(let c of strand){
            if(c=="A"){
                securityStrand+="T"
            }else if(c=="T"){
                securityStrand+="A"
            }else if(c=="C"){
                securityStrand+="G"
            }else if(c=="G"){
                securityStrand+="C"
            }else if(c=="."){
                securityStrand+="P"
            }else if(c=="U"){
                securityStrand+="N"
            }else{
                securityStrand+=c
            }
        }

        return securityStrand;
    }

    generatePretty(strand, securityStrand){

        

        if(strand.length==securityStrand.length){

            let pretty="";

            for(var i=0; i<securityStrand.length; i++){
                pretty+="|"
            }

            return pretty;
        }else{
            return "Invalid Strands"
        }
    }
}



module.exports = encoder;
