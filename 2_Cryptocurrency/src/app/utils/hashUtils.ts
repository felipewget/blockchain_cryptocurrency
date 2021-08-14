import { v4 as uuidv4 } from 'uuid';

export const toHex = async (string:string) => {

    let result = '';
    for (let i=0; i<string.length; i++) {
      result += string.charCodeAt(i).toString(16);
    }
    return result;

}

export const getUUID = () => uuidv4().split('-').join('')