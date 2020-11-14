export const saveJson = async (obj) => {
  let str = JSON.stringify(obj);
  let data = encode(str);

  let blob = new Blob( [data], {
    type: 'application/json'
  });

  return URL.createObjectURL(blob);
}

const encode = (str) => {
  let out = [];

  for (let i = 0; i < str.length; i++ ) {
    out[i] = str.charCodeAt(i);
  }

  return new Uint8Array(out);
};
