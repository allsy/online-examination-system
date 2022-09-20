//Checking the crypto module
import { createCipheriv, createDecipheriv } from "crypto";
const algorithm = 'aes-256-cbc'; //Using AES encryption

const key = "a5454sf445dfg58efjhjgh487515eded";
const iv = "sd155sad151d4778";

//Encrypting text
const encrypt = (text:any)=> {
    if(typeof text != 'string') return "";

    let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');

}

// Decrypting text
const decrypt = (text:any)=> {
    if(typeof text != 'string') return "";

   let encryptedText = Buffer.from(text, 'hex');

   let decipher = createDecipheriv(algorithm, key, iv);   
   let decrypted = decipher.update(encryptedText);

   if(decrypted.byteLength === 0){ return ""; }
   else{
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
   }
}

export { encrypt, decrypt };