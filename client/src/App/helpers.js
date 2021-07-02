/* generate an array of column objects */
import * as XLSX from "xlsx";

export const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
  return o;
};

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
        data,
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
