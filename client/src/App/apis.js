import * as XLSX from "xlsx";
import {parseSheetData} from "./helpers";

export function uploadFile(file, fileName) {
  const formData = new FormData();
  formData.append("name", `${fileName}`);
  formData.append("file", file);
  return fetch("/upload", {
    method: 'post',
    body: formData
  }).then(rs => rs.json())
}

export function downloadFile(fileName) {
  return fetch(`/download?name=${fileName}`, {
    method: 'get',
  }).then(rs => rs.blob())
}


export function deleteFile(fileName) {
  return fetch(`/delete-file?name=${fileName}`, {
    method: 'delete',
  }).then(rs => rs.json())
}

export function getListFiles() {
  return fetch("/list-files", {
    method: 'get',
  }).then(rs => rs.json())
}


export function saveFile({data, sheetName, fileName}) {
  const ws = XLSX.utils.aoa_to_sheet((parseSheetData(data)));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet 1');
  const wopts = {bookType: 'xlsx', bookSST: false, type: 'array'};
  const wbout = XLSX.write(wb, wopts);
  const file = new Blob([wbout], {type: "application/octet-stream"});
  return uploadFile(file, fileName).then(rs => {
    return {
      wb,
      fileName: rs.data.name
    }
  })
}

