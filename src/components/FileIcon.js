import pdfIcon from '../assets/image/pdf.svg';
import xlsIcon from '../assets/image/xls.svg';
import docIcon from '../assets/image/doc.svg';
import pngIcon from '../assets/image/png.svg';
import csvIcon from '../assets/image/csv.svg';
import externalLinkIcon from '../assets/image/external-link.svg';
import noFileIcon from '../assets/image/file-no-format.svg';
import { attachmentType } from './Enumeration';

export function getAttachedFileIcon(fileExtension, nattachmenttypecode) {
    let fileUrl = "";
    if(nattachmenttypecode === attachmentType.LINK) {
      fileUrl = externalLinkIcon;
    } else {
      const imgExtList = ["JPG", "PNG", "SVG"];
      if (imgExtList.includes(fileExtension.toUpperCase()) > 0) {
        fileUrl = pngIcon;
      } else if (fileExtension.toUpperCase() === "PDF") {
        fileUrl = pdfIcon;
      } else if (fileExtension.toUpperCase() === "XLS" || fileExtension.toUpperCase() === "XLSX") {
        fileUrl = xlsIcon;
      } else if (fileExtension.toUpperCase() === "DOC" || fileExtension.toUpperCase() === "DOCX") {
        fileUrl = docIcon;
      } else if (fileExtension.toUpperCase() === "CSV") {
        fileUrl = csvIcon;
      } else {
        fileUrl = noFileIcon;
      }
    }
    return fileUrl;
  }