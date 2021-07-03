import React from 'react';
import PropTypes from 'prop-types';
import {Button, Spinner} from "reactstrap";
import {useHomeContext} from "../pages/Home";
import {deleteFile, saveFile} from "../apis";
import * as XLSX from "xlsx";
import {debounce} from "../helpers";

function FileActions() {
  const {selectedItem, loading, setLoading, gridData, setSelectedItem, setReloadFileList} = useHomeContext()

  function handleSave() {
    setLoading('save');
    return saveFile({
      data: gridData.data,
      fileName: selectedItem.name,
      sheetName: gridData.sheetName
    }).then(rs => {
      return rs;
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setLoading(false)
    })
  }

  function handleDelete() {
    setLoading('delete');
    return deleteFile(selectedItem.name).then(rs => {
      alert(rs.message)
      setSelectedItem(null);
      setReloadFileList(true)
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleExport = React.useCallback(() => {
    setLoading('export');
    handleSave().then(rs => {
      XLSX.writeFile(rs.wb, rs.fileName)
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setLoading(false)
    })
  }, [gridData, selectedItem])

  const debounceSaving = debounce(handleSave)

  return (
    <div style={{textAlign: 'right'}}>
      {selectedItem && <strong>
        {selectedItem.name}
      </strong>}
      <br/>
      <Button disabled={!selectedItem} onClick={handleExport} color="secondary">
        Export
        {' '}
        {loading === 'export' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
      {' '}
      <Button disabled={!selectedItem} onClick={debounceSaving} color="primary">
        Save
        {' '}
        {loading === 'save' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
      {' '}
      <Button disabled={!selectedItem} onClick={handleDelete} color="danger">
        Delete
        {' '}
        {loading === 'delete' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
    </div>
  );
}

FileActions.propTypes = {};
FileActions.defaultProps = {};

export default FileActions;
