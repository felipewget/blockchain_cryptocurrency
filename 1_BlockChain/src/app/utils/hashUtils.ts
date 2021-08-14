export const toHex = async (string:string) => {

    let result = '';
    for (let i=0; i<string.length; i++) {
      result += string.charCodeAt(i).toString(16);
    }
    return result;

}