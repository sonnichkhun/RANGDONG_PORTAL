import React from 'react';
import { Slider, Row, Col, Spin, Button, Icon } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Modal as RSModal,
  ModalBody as RSModalBody,
  ModalFooter as RSModalFooter,
} from 'reactstrap';
import { useAvatarBase64Uploader } from './AvatarBase64UploaderHook';
import { IImage } from './AvatarUploader';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { listAspectRatio } from 'config/consts';
import './AvatarBase64Uploader.scss';

export interface AvatarBase64UploaderProps {
  defaultValue?: IImage | string;
  onUploadImage?: (
    file: File,
    params?: { [key: string]: any },
  ) => Promise<string>;
  onCroppedComplete?: (value: IImage | string) => void;
  aspectRatio?: number;
  disabledAspectRatio?: boolean;
}

export default function AvatarBase64Uploader(props: AvatarBase64UploaderProps) {
  const { defaultValue, onUploadImage, onCroppedComplete } = props;

  const {
    translate,
    image,
    defaultUrl,
    currentPreview,
    handleClosePreview,
    handlePreview,
    source,
    cropper,
    cropQuality,
    handleImageLoaded,
    handleCropComplete,
    handleChangeCrop,
    handleChangeQualityBySlide,
    cropPreview,
    handleCrop,
    handleCancelCrop,
    inputFile,
    inputId,
    imageRef,
    originalSize,
    afterCropSize,
    disableScaleQuality,
    handleChangeAspectRatio,
  } = useAvatarBase64Uploader(defaultValue, onUploadImage, onCroppedComplete);

  return (
    <>
      <div className="avatar-base64-uploader">
        <Spin spinning={!!image} className="upload-image-item">
          <React.Fragment>
            <div className="d-flex">
              {defaultUrl && (
                <div className="thumbnail mb-2 mr-4">
                  <img src={defaultUrl} alt="" />
                  <RSModal
                    isOpen={!!currentPreview}
                    backdrop
                    toggle={handleClosePreview}
                    className="image-upload-preview"
                    onChange={handleClosePreview}
                    unmountOnClose
                  >
                    <RSModalBody>
                      <img
                        src={currentPreview}
                        alt=""
                        width="300px"
                        height="300px"
                      />
                    </RSModalBody>
                  </RSModal>
                  <div className="overlay">
                    <Button
                      htmlType="button"
                      type="link"
                      onClick={handlePreview(defaultUrl)}
                    >
                      <Icon type="eye" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center">
                <label
                  className="d-flex align-items-center justify-content-center upload-button"
                  htmlFor={inputId}
                >
                  {defaultUrl
                    ? translate('images.placeholder.changeImage')
                    : translate('images.placeholder.uploadImage')}
                </label>
              </div>
            </div>
          </React.Fragment>

          <RSModal isOpen={!!image} backdrop="static">
            <RSModalBody>
              <div className="cropper-container container-grid">
                <div
                  className="crop-zone"
                  style={{
                    background: 'url("/assets/img/png-background.jpg")',
                  }}
                >
                  {source && (
                    <ReactCrop
                      src={source}
                      crop={cropper}
                      ruleOfThirds
                      onImageLoaded={handleImageLoaded}
                      onComplete={handleCropComplete}
                      onChange={handleChangeCrop}
                    />
                  )}
                </div>
                <div className="preview-zone">
                  <div
                    className="preview-zone-wrapp"
                    style={{
                      background: 'url("/assets/img/png-background.jpg")',
                    }}
                  >
                    <img
                      src={cropPreview}
                      alt=""
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </div>
              </div>
              <div className="image-control-area">
                <Row className="mt-4">
                  <SelectAutoComplete
                    defaultValue={listAspectRatio[0].id}
                    list={listAspectRatio}
                    placeholder={translate('images.placeholder.aspectRatio')}
                    onChange={handleChangeAspectRatio}
                    allowClear={false}
                    className="w-100"
                  />
                </Row>
                <Row className="mt-4">
                  {!disableScaleQuality && (
                    <>
                      <Col lg={24} className="image-control-title">
                        Chất lượng (JPEG, JPG)
                      </Col>
                      <Col lg={18}>
                        <Slider
                          min={1}
                          max={100}
                          onChange={handleChangeQualityBySlide}
                          defaultValue={cropQuality}
                        />
                      </Col>
                      <Col lg={6}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: 36 }}
                        >
                          <div className="w-100 text-center image-control-value">
                            {cropQuality} %
                          </div>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Kích thước file gốc
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {originalSize} &nbsp; KB
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Kích thước đầu ra
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {afterCropSize} &nbsp; KB
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Chiều dài gốc
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(image?.width)} &nbsp; px
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Chiều rộng gốc
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(image?.height)} &nbsp; px
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Chiều dài khung
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(imageRef.current?.width)} &nbsp; px
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Chiều rộng khung
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(imageRef.current?.height)} &nbsp; px
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={18} className="image-control-title">
                    Chiều dài canvas
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(cropper.width)} &nbsp; {cropper.unit}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2 mb-4">
                  <Col lg={18} className="image-control-title">
                    Chiều rộng canvas
                  </Col>
                  <Col lg={6}>
                    <div className="w-100 text-center image-control-value">
                      {Math.round(cropper.width)} &nbsp; {cropper.unit}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="de-flex justify-content-center align-items-center"></div>
            </RSModalBody>
            <RSModalFooter className="image-upload-modal-actions">
              <Button
                htmlType="button"
                type="primary"
                onClick={handleCrop}
                className="btn-crop"
              >
                {translate('general.actions.crop')}
              </Button>
              <Button
                htmlType="button"
                type="default"
                onClick={handleCancelCrop}
              >
                {translate('general.actions.cancel')}
              </Button>
            </RSModalFooter>
          </RSModal>
        </Spin>
      </div>
      {inputFile}
    </>
  );
}

AvatarBase64Uploader.defaultProps = {
  aspectRatio: 1,
  disabledAspectRatio: true, // default disable aspect ratio
};
