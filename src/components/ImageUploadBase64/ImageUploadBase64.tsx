import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { listAspectRatio } from 'config/consts';
import { Moment } from 'moment';
import React from 'react';
import Cropper from 'react-cropper';
import { useTranslation } from 'react-i18next';
import {
    Modal as RSModal,
    ModalBody as RSModalBody,
    ModalFooter as RSModalFooter,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import './ImageUploadBase64.scss';

export type ImageUploadMethod = (
    file: File,
    params?: { [key: string]: any },
) => Promise<string>;

export interface IImage {
    id?: number;
    name?: string;
    url?: string;
    thumbUrl?: string;
    originUrl?: string;
    createdAt?: Moment;
    updatedAt?: Moment;
    deletedAt?: Moment;
}

interface ImageUploadItemProps {
    key?: string | number;
    defaultValue?: string;
    aspectRatio?: number;
    uploadText?: string;
    onChange?: (value: IImage) => void;
    onDelete?: (event?) => void;
    maxSizeEdge?: number;
}

/* cropper ref */
const cropperRef = React.createRef<Cropper>();
export interface AspectRatio {
    name: string;
    value: number;
}

function AvatarUploader(props: ImageUploadItemProps) {
    const { defaultValue, onChange } = props;
    const [translate] = useTranslation();
    const [image, setImage] = React.useState<any>(null);
    const [result, setResult] = React.useState<string>(null);
    const [file, setFile] = React.useState<File>(
        new File([], 'productImage', { lastModified: null }),
    );
    const [currentPreview, setCurrentPreview] = React.useState<string>(null);
    const [id] = React.useState<string>(uuidv4());

    const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>({
        name: '1',
        value: 1,
    });

    React.useEffect(() => {
        setResult(defaultValue);
    }, [defaultValue]);


    /* handleChange file*/
    const handleChange = event => {
        if (event.target.files[0]) {
            const reader: FileReader = new FileReader();
            reader.onload = () => {
                const image = new Image();
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

    /* handleOpen preview */
    const handlePreview = (url: string) => {
        return () => {
            setCurrentPreview(url);
        };
    };

    /* cropper */
    const { cropper } = React.useMemo(() => {
        if (image) {
            return {
                cropper: (
                    <Cropper
                        src={image.src}
                        aspectRatio={aspectRatio.value}
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

    /* handleCrop */
    const handleCrop = React.useCallback(() => {
        const result: string = cropperRef.current.getCroppedCanvas().toDataURL();
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
    }, [file, onChange, props]);
    /* handleCancel */
    const handleCancel = React.useCallback(() => {
        setImage(null);
        setResult(null);
    }, [setImage, setResult]);

    /* handleClosePreview */
    const handleClosePreview = React.useCallback(() => {
        if (currentPreview) {
            setCurrentPreview(null);
        }
    }, [currentPreview]);

    /* input */
    const inputFile = React.useMemo(
        () => (
            <input
                type="file"
                id={id}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        ),
        [id],
    );

    const handleChangeAspectRatio = React.useCallback(
        (...[, item]) => {
            setAspectRatio({ ...item });
        },
        [setAspectRatio],
    );

    return (
        <div className="avatar-uploader" key={props.key}>
            <Spin spinning={!!image} className="upload-image-item">
                <React.Fragment>
                    <div className="d-flex">
                        {result && (
                            <div className="thumbnail mb-2 mr-4">
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
                                        <img src={currentPreview} alt="" width="200px" height="200px" />
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
                                </div>
                            </div>
                        )}
                        <div className="d-flex align-items-center">
                            <label
                                className="d-flex align-items-center justify-content-center upload-button"
                                htmlFor={id}
                            >
                                {result
                                    ? translate('images.placeholder.changeImageBase64')
                                    : translate('images.placeholder.uploadImageBase64')}
                            </label>
                        </div>
                    </div>
                </React.Fragment>

                <RSModal isOpen={!!image} backdrop="static">
                    <RSModalBody>
                        <div className="cropper-container">{cropper}</div>
                        <SelectAutoComplete
                            defaultValue={listAspectRatio[0].id}
                            list={listAspectRatio}
                            placeholder={translate('images.placeholder.aspectRatio')}
                            onChange={handleChangeAspectRatio}
                            allowClear={false}
                            className="w-100"
                        />
                    </RSModalBody>
                    <RSModalFooter className="image-upload-modal-actions">
                        <Button htmlType="button" type="primary" onClick={handleCrop} className="btn-crop">
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

AvatarUploader.defaultProps = {
    aspectRatio: 1,
    uploadText: 'Upload',
};


export default AvatarUploader;
