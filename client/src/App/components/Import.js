import React from 'react';
import {Form, FormGroup, Input, Spinner} from 'reactstrap';
import {uploadFile} from "../apis";
import {useHomeContext} from "../pages/Home";


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
    if (file) {
      handleFile(file)
      setFileName(file.name)
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: 200,
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


function Import() {
  const {setSelectedItem, loading, setLoading, setReloadFileList} = useHomeContext()

  const handleImportFile = (file) => {
    setLoading('import')
    uploadFile(file, file.name).then(rs => {
      setSelectedItem({
        name: rs.data.name
      });
      setLoading(false)
      setReloadFileList(true);
    }).catch(() => {
      alert("Something went wrong!")
      setLoading(false)
    }).finally(() => {
    })
  }

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleImportFile(files[0]);
  };

  return (
    <Form>
      <div>
        <DragDropFile handleFile={handleImportFile}/>
        {loading === 'import' && <Spinner size="lg" style={{float: 'right'}}>{' '}</Spinner>}
        <br/>
        <FormGroup>
          Or <Input type="file" name="file" id="exampleFile" accept={SheetJSFT}
                    onChange={handleChange}/>
        </FormGroup>
      </div>
    </Form>
  );
}

Import.propTypes = {};
Import.defaultProps = {};

export default Import;
