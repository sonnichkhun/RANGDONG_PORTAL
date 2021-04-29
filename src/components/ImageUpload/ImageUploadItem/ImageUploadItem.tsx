import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import { notification } from 'helpers';
import { dataURIToFile } from 'helpers/data-uri-to-blob';
import React from 'react';
import Cropper from 'react-cropper';
import { useTranslation } from 'react-i18next';
import {
  Modal as RSModal,
  ModalBody as RSModalBody,
  ModalFooter as RSModalFooter,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from '../ImageUpload';
import './ImageUploadItem.scss';

export type ImageUploadMethod = (
  file: File,
  params?: { [key: string]: any },
) => Promise<IImage>;

interface ImageUploadItemProps {
  key?: string | number;
  defaultValue?: IImage | string;
  aspectRatio?: number;
  uploadText?: string;
  onChange?: (value: IImage) => void;
  onUpload?: ImageUploadMethod;
  onDelete?: (event?) => void;
}

const MAX_EDGE_SIZE: number = 472;

const cropperRef = React.createRef<Cropper>();

function ImageUploadItem(props: ImageUploadItemProps) {
  const { aspectRatio, defaultValue, onChange, onUpload, onDelete } = props;

  const [translate] = useTranslation();
  const [image, setImage] = React.useState<HTMLImageElement>(null);
  const [result, setResult] = React.useState<string>(null);
  const [file, setFile] = React.useState<File>(
    new File([], 'productImage', { lastModified: null }),
  );
  const [currentPreview, setCurrentPreview] = React.useState<string>(null);
  const [id] = React.useState<string>(uuidv4());

  React.useEffect(() => {
    if (defaultValue && typeof defaultValue === 'object') {
      setResult(defaultValue?.url);
    }
    if (typeof defaultValue !== 'object') {
      setResult(defaultValue);
    }
  }, [setResult, defaultValue]);

  const handleChange = event => {
    if (event.target.files[0]) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const image: HTMLImageElement = new Image();
        image.src = reader.result.toString();
        setImage(image);
      };
      setFile(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setFile(null);
    }
    event.target.value = null;
  };

  function handlePreview(url: string) {
    return () => {
      setCurrentPreview(url);
    };
  }

  const { cropper, ratio } = React.useMemo(() => {
    if (image) {
      return {
        cropper: (
          <Cropper
            src={image.src}
            aspectRatio={aspectRatio}
            ref={cropperRef as any}
          />
        ),
        ratio: image.width / image.height,
      };
    }
    return {
      cropper: null,
      ratio: 1,
    };
  }, [image, aspectRatio]);

  const handleCrop = React.useCallback(() => {
    const result: string = cropperRef.current.getCroppedCanvas().toDataURL();
    if (onUpload && file !== null) {
      const newFile: File = dataURIToFile(result, file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      onUpload(newFile)
        .then((imageFile: IImage) => {
          setResult(imageFile?.url);
          setImage(null);
          if (onChange) {
            onChange(imageFile);
          }
        })
        .catch((error: Error) => {
          notification.error({
            message: translate('components.upload.uploadError'),
            description: error.message,
          });
        });
    } else {
      // setResult(result);
      setImage(null);
      if (onChange) {
        const newImageFile: IImage = {
          name: file.name,
          url: result,
          originUrl: result,
          thumbUrl: result,
        };
        props.onChange(newImageFile);
      }
    }
  }, [file, onChange, onUpload, props, translate]);

  const handleDelete = React.useCallback(
    event => {
      setResult(null);
      setFile(null);
      if (onDelete) {
        onDelete(event);
      }
    },
    [onDelete],
  );

  const handleCancel = React.useCallback(() => {
    setImage(null);
    setResult(null);
  }, [setImage, setResult]);

  const handleClosePreview = React.useCallback(() => {
    if (currentPreview) {
      setCurrentPreview(null);
    }
  }, [currentPreview]);

  let width: number;
  let height: number;

  if (ratio < 1) {
    height = MAX_EDGE_SIZE;
    width = Math.round(height * ratio);
  } else {
    width = MAX_EDGE_SIZE;
    height = Math.round(width / ratio);
  }

  const inputFile = React.useMemo(
    () => <input type="file" id={id} onChange={handleChange} />,
    [id],
  );

  return (
    <div className="image-upload-item mr-2" key={props.key}>
      <Spin spinning={!!image} className="upload-image-item">
        {result ? (
          <div className="thumbnail">
            <img src={result} alt="" />
            <RSModal
              isOpen={!!currentPreview}
              backdrop
              toggle={handleClosePreview}
              className="image-upload-preview"
              onChange={handleClosePreview}
              unmountOnClose
            >
              <RSModalBody>
                <img src={currentPreview} alt="" />
              </RSModalBody>
            </RSModal>
            <div className="overlay">
              <Button
                htmlType="button"
                type="link"
                onClick={handlePreview(result)}
              >
                <Icon type="eye" />
              </Button>
              <Button htmlType="button" type="link" onClick={handleDelete}>
                <Icon type="delete" />
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="upload-button">
            <Icon type="plus" />
          </label>
        )}
        <RSModal isOpen={!!image} backdrop="static">
          <RSModalBody>
            <div className="cropper-container">{cropper}</div>
          </RSModalBody>
          <RSModalFooter className="image-upload-modal-actions">
            <Button htmlType="button" type="primary" onClick={handleCrop}>
              {translate('general.actions.crop')}
            </Button>
            <Button htmlType="button" type="default" onClick={handleCancel}>
              {translate('general.actions.cancel')}
            </Button>
          </RSModalFooter>
        </RSModal>
        {inputFile}
      </Spin>
    </div>
  );
}

ImageUploadItem.defaultProps = {
  aspectRatio: 1,
  uploadText: 'Upload',
};

export default ImageUploadItem;
