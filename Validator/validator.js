class validator{

    validate(sequence, securitySequence){

        if(sequence.length !== securitySequence.length){
            return false
        }else{

            for(var i=0; i<sequence.length; i++){
                    let seqChar = sequence[i];
                for(var j=0; j<securitySequence.length; j++){
                    let securityChar = securitySequence[i];

                    if(seqChar=="A" && securityChar=="T"){
                        continue
                    }else if(seqChar=="C" && securityChar=="G"){
                        continue
                    }else if(seqChar=="T" && securityChar=="A"){
                        continue
                    }else if(seqChar=="G" && securityChar=="C"){
                        continue;
                    }else if(seqChar=="1" && securityChar=="1"){
                        continue;
                    }
                    else if(seqChar=="2" && securityChar=="2"){
                        continue;
                    }
                    else if(seqChar=="3" && securityChar=="3"){
                        continue;
                    }
                    else if(seqChar=="4" && securityChar=="4"){
                        continue;
                    }
                    else if(seqChar=="5" && securityChar=="5"){
                        continue;
                    }
                    else if(seqChar=="6" && securityChar=="6"){
                        continue;
                    }
                    else if(seqChar=="7" && securityChar=="7"){
                        continue;
                    }
                    else if(seqChar=="8" && securityChar=="8"){
                        continue;
                    }
                    else if(seqChar=="9" && securityChar=="9"){
                        continue;
                    }
                    else if(seqChar=="0" && securityChar=="0"){
                        continue;
                    }else if(seqChar=="." && securityChar=="P"){
                        continue;
                    }else if(seqChar=="U" && securityChar=="N"){
                        continue;
                    }else{
                        return false
                    }
                }
            }

         

        }

        return true
    }
}

module.exports = validator;