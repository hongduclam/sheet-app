import React from 'react';
import PropTypes from 'prop-types';
import {useHomeContext} from "../pages/Home";
import {getListFiles} from "../apis";
import {ListGroup, ListGroupItem, Spinner, Alert} from "reactstrap";


function FileSelectList() {
  const [fileItems, setFileItems] = React.useState([])
  const {selectedItem, setSelectedItem, loading, setLoading, reloadFileList, setReloadFileList} = useHomeContext()

  React.useEffect(() => {
    if(reloadFileList) {
      setLoading('load-list-file')
      getListFiles().then(rs => {
        setFileItems(rs);
        setLoading(false)
        setReloadFileList(false)
      })
    }
  }, [reloadFileList])

  const handleSelect = (selectedItem) => {
    setSelectedItem(selectedItem)
  }

  return <div style={{overflow: 'auto', height: `calc(100vh - 550px)`}}>
    <h5> File List </h5>
    {loading === 'load-list-file' && <Spinner>{' '}</Spinner>}
    {
      !fileItems.length && <Alert style={{textAlign: 'center'}} color="info">
        No Files
      </Alert>
    }
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

FileSelectList.propTypes = {};
FileSelectList.defaultProps = {};

export default FileSelectList;
