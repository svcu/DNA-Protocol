class decoder{

    decode(sequence){
        let alphabet = {1:"A", 2:"B", 3:"C", 4:"D", 5:"E", 6:"F", 7:"G", 8:"H", 9:"I", 10:"J", 11:"K", 12:"L", 13:"M", 14:"N", 15:"O", 16:"P", 17:"Q", 18:"R", 19:"S", 20:"T", 21:"U", 22:"V", 23:"W", 24:"X", 25:"Y", 26:"Z"}
        let decoded = [];
        let item = "";
        let last="";
        let counter = 0;
        let char = "";

        for(var i=0; i<sequence.length; i++){
            let c = sequence[i] 

           

            

      

            if(c=="T"){
                item="";
            }else if(c=="C"){
                counter++;
                char=alphabet[counter];
            }else if(c=="A"){
                console.log(char)
                counter=0;
                item+=char
                item+="";   
                
           ///     console.log(item)
            }else if(c=="G"){
        
                decoded.push(item)
                continue
            }else if(c=="."){
                item+="."
            }else if(c=="U"){
                item+=" "
                last="U"

            }else if(c=="1" || c=="2" || c=="3"|| c=="4"|| c=="5"|| c=="6"|| c=="7"|| c=="8"|| c=="9"|| c=="0"){
                console.log("NUMBER")
                char=""
                item+=c
            }else if(c=="1" && last=="U" || c=="2" && last=="U" || c=="3" && last=="U"|| c=="4" && last=="U"|| c=="5" && last=="U"|| c=="6" && last=="U"|| c=="7" && last=="U"|| c=="8" && last=="U"|| c=="9" && last=="U"|| c=="0" && last=="U"){
                item+=c
            }else{
                char=c
            }
        }

    
        
   

        return decoded
    }
}


module.exports = decoder;


