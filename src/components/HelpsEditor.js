import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box } from '@material-ui/core';

const HelpsEditor = ({ onChange, onReady, onBlur, onFocus, data, title }) => {

  return (
    <Box mt={6}>
      <h2>{title}</h2>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onReady={onReady}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </Box>
  )
}

export default HelpsEditor;
