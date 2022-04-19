import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Box, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({


  imgContainer: {
    transition: "all .3s",
    display: "flex",
    height: "100%",
    position: "relative"
  },

  imgContainerActive: {
    border: `1px dashed ${theme.palette.primary.main}`,
    borderRadius: 5,
    boxShadow: "7px 15px 18px 10px rgba(0,0,0,0.3);"
  },

  imgContainerNotActive: {
    border: `1px dashed ${theme.palette.grey[200]}`,
    borderRadius: 5
  },

  iconPreview: {
    height: 80,
    width: 80
  },

  bannerPreview: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0
  }
}));




type ImgUploadInputProps = {
  multiple?: boolean;
  accept?: string;
  icon?: any;
  className?: string;
  description?: string;
  name: string;
  change: (e: any) => void;
  button?: {
    text: string;
  };
  previewImage?: string;
  previewFor: "icon" | "banner";
  width: string,
  height: string
}

const ImgUploadInput = (options: ImgUploadInputProps) => {

  const { multiple, accept, icon, button, className, previewFor, description, height, width, change, name, previewImage } = options;

  const classes = useStyles();

  const [files, setFiles] = useState<any[]>([]);

  const [preview, setPreview] = useState<any>(null)

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setPreview(files[0].preview);
      change({ target: { name: name, files: files, type: "file" } });
    }
  }, [files])

  useEffect(() => {
    if (previewImage) {
      setPreview(previewImage)
    }
  }, [previewImage])

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept ? accept : 'image/*',
    maxFiles: 1,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    },
    onDragEnter: (event) => {
      setActive(true);
    },
    onDragLeave: (event) => {
      setActive(false);
    },
    onDropAccepted: () => {
      setActive(false);
    }
  });

  return (
    <Box className={className} width={width} height={height} m="auto" bgcolor="white" borderRadius={5}>
      <Box
        {...getRootProps()}
        style={{ cursor: "pointer" }} height="100%"
      >
        <Box className={clsx([classes.imgContainer], {
          [classes.imgContainerActive]: active,
          [classes.imgContainerNotActive]: !active,
        })}>
          {
            preview ?
              previewFor === "icon" ?
                <Box display="flex" textAlign="center" width="100%" height="100%">
                  <Box m="auto">
                    <img className={classes.iconPreview} src={preview} alt="" />
                    <Box fontWeight="bold" fontSize="1.25rem" lineHeight="1.75rem" color={active ? "red" : "gray"}>
                      {description ? description : "Arrastre una imagen o haga click"}
                    </Box>
                  </Box>
                </Box>
                :
                <img className={classes.bannerPreview} src={preview} alt="" />

              :
              <Box textAlign="center" m="auto" px={6}>
                <Box color={active ? "red" : "gray"}>
                  {icon}
                </Box>
                <Box fontWeight="bold" fontSize="1.25rem" lineHeight="1.75rem" color={active ? "red" : "gray"}>
                  {description ? description : "Arrastre una imagen o haga click"}
                </Box>
              </Box>
          }
        </Box>
        {
          button ?
            <Box textAlign="center" mt={2}>
              <Button color="primary">
                {button.text}
              </Button>
            </Box>
            :
            null
        }
        <input type="file" {...getInputProps()} />
      </Box>
    </Box >

  )
}

export default ImgUploadInput;
