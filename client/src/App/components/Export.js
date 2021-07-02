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

  return <div>
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

function Export() {
  const {selectedItem} = useHomeContext()
  const [exLoading, setExLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [gridData, setGridData] = React.useState();

  let canvasGrid = null;
  const gridRef = React.useRef(null);

  const handleExport = React.useCallback(() => {
    setExLoading(true);
    const ws = XLSX.utils.aoa_to_sheet(canvasGrid.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, gridData.sheetName || 'Sheet 1');
    const wopts = {bookType: 'xlsx', bookSST: false, type: 'array'};
    const wbout = XLSX.write(wb, wopts);
    const file = new Blob([wbout], {type: "application/octet-stream"});
    uploadFile(file, selectedItem.name).then(rs => {
      XLSX.writeFile(wb, rs.data.name)
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setExLoading(false)
    })
  }, [gridData, canvasGrid, selectedItem])

  React.useEffect(() => {
    if(gridData) {
      gridRef.current.innerHTML = ''
      canvasGrid = CanvasDatagrid({
        parentNode: gridRef.current,
        data: parseData(gridData.data),
        showNewRow: true,
        scrollHeight: 500,
        scrollWidth: 500
      });
    }
    return () => gridRef.current.innerHTML = ''
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
        <hr />
        <div style={{textAlign: 'right'}}>
          <strong>
            {selectedItem.name}
          </strong>
          <Button onClick={handleExport}>
            Export File
            {' '}
            {exLoading && <Spinner size={'sm'}>{' '}</Spinner>}
          </Button>
        </div>
      </Col>
      <Col md={10}>
        {loading && <Spinner>{' '}</Spinner>}
        <div id={'grid_container'} className="grid_container" ref={gridRef} style={{overflow: 'auto', height: `calc(100vh - 100px)`}}/>
      </Col>
    </Row>
  );
}

Export.propTypes = {};
Export.defaultProps = {};

export default Export;
