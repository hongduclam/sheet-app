/* generate an array of column objects */
import * as XLSX from "xlsx";

export const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
  return o;
};


function parseData(json) {
  const updateData = [...json]
  var L = 0;
  updateData.forEach(function (r) {
    if (L < r.length)
      L = r.length;
  });
  console.log(L);
  for (var i = json[0].length; i < L; ++i) {
    updateData[0][i] = "";
  }
  return updateData;
}


export function parseGridData(file) {
  return new Promise((rs, rj) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      /* Update state */
      rs({
        data: parseData(data),
        fileName: file.name,
        cols: make_cols(ws['!ref']),
        sheetName: wsname
      })
    };
    if (rABS) {
      reader.readAsBinaryString(file)
    }
    else {
      reader.readAsArrayBuffer(file)
    }
  })

}

export function parseSheetData(canvasGridData) {
  return canvasGridData.map(item => {
    if (!Array.isArray(item)) {
      return Object.values(item);
    }
    return item;
  })
}

export function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
