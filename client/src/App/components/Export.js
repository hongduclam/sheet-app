import React from 'react';
import PropTypes from 'prop-types';
import CanvasDatagrid from "canvas-datagrid";
import {Button, Spinner, Row, Col, Fade, ListGroup, ListGroupItem} from "reactstrap";
import * as XLSX from "xlsx";
import {downloadFile, getListFiles, uploadFile} from "../apis";
import {parseGridData} from "../helpers";
import {useHomeContext} from "../pages/Home";


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

function FileSelectList() {
  const [loading, setLoading] = React.useState(false);
  const [fileItems, setFileItems] = React.useState([])
  const {selectedItem, setSelectedItem} = useHomeContext()

  React.useEffect(() => {
    setLoading(true)
    getListFiles().then(rs => {
      setFileItems(rs);
      setLoading(false)
    })
  }, [])

  const handleSelect = (selectedItem) => {
    setSelectedItem(selectedItem)
  }

  return <div style={{overflow: 'auto', height: `calc(100vh - 250px)`}}>
    <h5> File List </h5>
    {loading && <Spinner>{' '}</Spinner>}
    <ListGroup>
      {
        fileItems.map(fileItem => {
          return <ListGroupItem onClick={() => handleSelect(fileItem)}
                                active={selectedItem && selectedItem.name === fileItem.name} tag="button" action>
            {fileItem.name}
          </ListGroupItem>
        })
      }
    </ListGroup>
  </div>
}

function parseSheetData(canvasGridData) {
  return canvasGridData.map(item => {
    if (!Array.isArray(item)) {
      return Object.values(item);
    }
    return item;
  })
}

function Export() {
  const {selectedItem} = useHomeContext()
  const [exLoading, setExLoading] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [gridData, setGridData] = React.useState();

  let canvasGrid = null;
  const gridRef = React.useRef(null);

  function handleSave() {
    setSaveLoading(true);
    const ws = XLSX.utils.aoa_to_sheet((parseSheetData(canvasGrid.data)));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, gridData.sheetName || 'Sheet 1');
    const wopts = {bookType: 'xlsx', bookSST: false, type: 'array'};
    const wbout = XLSX.write(wb, wopts);
    const file = new Blob([wbout], {type: "application/octet-stream"});
    return uploadFile(file, selectedItem.name).then(rs => {
      return {
        wb,
        fileName: rs.data.name
      }
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setSaveLoading(false)
    })
  }

  const handleExport = React.useCallback(() => {
    setExLoading(true);
    handleSave().then(rs => {
      XLSX.writeFile(rs.wb, rs.fileName)
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setExLoading(false)
    })
  }, [gridData, canvasGrid, selectedItem])

  React.useEffect(() => {
    if (gridData) {
      canvasGrid && canvasGrid.removeEventListener('endedit', handleSave)
      gridRef.current.innerHTML = ''
      canvasGrid = CanvasDatagrid({
        parentNode: gridRef.current,
        data: parseData(gridData.data),
        showNewRow: true
      });
      canvasGrid.addEventListener('endedit', handleSave)
    }
    return () => {
      canvasGrid && canvasGrid.removeEventListener('endedit', handleSave)
      gridRef.current.innerHTML = ''
    }
  }, [gridData])


  React.useEffect(() => {
    if (selectedItem) {
      setLoading(true)
      downloadFile(selectedItem.name).then(fileBlog => {
        parseGridData(fileBlog).then(gridData => {
          setGridData(gridData)
          setLoading(false)
        })
      })
    }
    return () => gridRef.current.innerHTML = ''
  }, [selectedItem])

  return (
    <Row style={{height: 'calc(100vh - 100px)'}}>
      <Col md={2}>
        <FileSelectList/>
        <hr/>
        <div style={{textAlign: 'right'}}>
          <strong>
            {selectedItem.name}
          </strong>
          <br/>
          <Button onClick={handleExport}>
            Export File
            {' '}
            {exLoading && <Spinner size={'sm'}>{' '}</Spinner>}
          </Button>
          {' '}
          <Button onClick={handleSave}>
            Save
            {' '}
            {saveLoading && <Spinner size={'sm'}>{' '}</Spinner>}
          </Button>
        </div>
      </Col>
      <Col md={10}>
        {loading && <Spinner>{' '}</Spinner>}
        <div id={'grid_container'} className="grid_container" ref={gridRef}
             style={{overflow: 'auto', height: `calc(100vh - 100px)`}}/>
      </Col>
    </Row>
  );
}

Export.propTypes = {};
Export.defaultProps = {};

export default Export;
