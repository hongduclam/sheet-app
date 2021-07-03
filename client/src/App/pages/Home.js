import React from 'react';
import Import from "../components/Import";
import Export from "../components/Export";
import {Col, Container, Row} from 'reactstrap'
import FileSelectList from "../components/FileSelectList";
import FileActions from "../components/FileActions";
import {saveFile} from "../apis";
import {toast} from "react-toastify";
import {debounce} from "../helpers";

const HomeContext = React.createContext();

export function useHomeContext() {
  return React.useContext(HomeContext);
}

function Home() {
  const [gridData, setGridData] = React.useState();
  const [loading, setLoading] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState();
  const [reloadFileList, setReloadFileList] = React.useState(true);


  function handleSave(callback) {
    setLoading('save');
    return saveFile({
      data: gridData.data,
      fileName: selectedItem.name,
      sheetName: gridData.sheetName
    }).then(rs => {
      callback && callback(rs)
      return rs;
    }).catch(() => {
      toast.error('Something went wrong!')
    }).finally(() => {
      setLoading(false)
    })
  }

  console.log({
    gridData
  })
  const debounceSaving = debounce(handleSave)

  return (
    <HomeContext.Provider value={{
      gridData,
      setGridData,
      selectedItem,
      setSelectedItem,
      setLoading,
      loading,
      reloadFileList,
      setReloadFileList,
      handleSave: debounceSaving
    }}>
      <Container fluid>
        <Row>
          <Col md={2}>
            <Import />
            <hr />
            <FileSelectList />
            <hr />
            <FileActions />
          </Col>
          <Col md={10}>
            <Export />
          </Col>
        </Row>
      </Container>
    </HomeContext.Provider>
  );
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
