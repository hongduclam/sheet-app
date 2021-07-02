import React from 'react';
import PropTypes from 'prop-types';
import * as XLSX from "xlsx";
import {Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';


const SheetJSFT = [
  "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(x => `.${x}`).join(",");


function DragDropFile({handleFile}) {
  const [fileName, setFileName] = React.useState('');

  const suppress = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    if(file) {
      handleFile(file)
      setFileName(file.name)
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: 300,
        border: '1px dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      onDrop={handleDrop}
      onDragEnter={suppress}
      onDragOver={suppress}
    >
      <div>
        Drag and Drop file .xlsx
      </div>
      <div>
        <strong>
          {fileName}
        </strong>
      </div>
    </div>
  );
}

/* generate an array of column objects */
const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
  return o;
};


function Import({onImport}) {

  const handleFile = (file) => {
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
      onImport({
        data,
        cols: make_cols(ws['!ref']),
        sheetName: wsname
      })
    };
    if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  return (
    <Form>
      <DragDropFile handleFile={handleFile}/>
      <br/>
      <FormGroup>
        Or <Input type="file" name="file" id="exampleFile" accept={SheetJSFT}
                  onChange={handleChange}/>
      </FormGroup>
    </Form>
  );
}

Import.propTypes = {};
Import.defaultProps = {};

export default Import;
