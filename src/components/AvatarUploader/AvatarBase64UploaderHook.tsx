import { SliderValue } from 'antd/lib/slider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from './AvatarUploader';
import { debounce } from 'core/helpers/debounce';
import { dataURIToFile } from 'helpers/data-uri-to-blob';
import { notification } from 'helpers';

export function useAvatarBase64Uploader(
  defaultValue: IImage | string,
  onUploadImage: (
    file: File,
    params?: { [key: string]: any },
  ) => Promise<string>,
  onCroppedComplete: (value: IImage | string) => void,
) {
  const [translate] = useTranslation();
  const [cropper, setCropper] = React.useState<ReactCrop.Crop>({
    unit: '%',
    width: 30,
    aspect: 1,
  });

  const [source, setSource] = React.useState<string>(null); // original source image

  const [image, setImage] = React.useState<any>(null);

  const [file, setFile] = React.useState<File>(
    new File([], 'productImage', { lastModified: null }),
  );
  const [defaultUrl, setDefaultUrl] = React.useState<string>(null); // state for preview image

  const [cropPreview, setCropPreview] = React.useState<string>(null); // preview crop for crop modal

  const imageRef = React.useRef<HTMLImageElement>(null);

  const [currentPreview, setCurrentPreview] = React.useState<string>(null);

  const [inputId] = React.useState<string>(uuidv4());

  const [cropQuality, setCropQuality] = React.useState<number>(20);

  React.useEffect(() => {
    if (defaultValue && typeof defaultValue === 'object') {
      setDefaultUrl(defaultValue?.url);
    }
    setDefaultUrl(defaultValue as string);
  }, [defaultValue]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files[0]) {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result.toString();
          image.onload = () => {
            setImage(image); // open cropper view modal
            setSource(reader.result as string); // update source for cropper
          };
        };
        setFile(event.target.files[0]);
        reader.readAsDataURL(event.target.files[0]);
      } else {
        setFile(null);
      }
      event.target.value = null;
    },
    [],
  ); // handleChange input file

  const handleChangeAspectRatio = React.useCallback(
    (aspect: number) => {
      setCropper({ ...cropper, aspect, width: 0, height: 0 });
    },
    [cropper],
  ); // handleChnage Aspect by autoComplete

  const handlePreview = (url: string) => {
    return () => {
      setCurrentPreview(url);
    };
  }; // open preview

  const handleClosePreview = React.useCallback(() => {
    if (currentPreview) {
      setCurrentPreview(null);
    }
  }, [currentPreview]); // close preview

  const inputFile = React.useMemo(
    () => (
      <input
        type="file"
        id={inputId}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    ),
    [handleChange, inputId],
  ); // input file

  const handleImageLoaded = React.useCallback((image: HTMLImageElement) => {
    imageRef.current = image;
  }, []); // map object to ref object

  const handleChangeCrop = React.useCallback((crop: ReactCrop.Crop) => {
    setCropper(crop);
  }, []); // change cropper size

  const handleCropComplete = React.useCallback(
    (crop: ReactCrop.Crop) => {
      if (imageRef.current && crop?.width && crop?.height) {
        setCropPreview(getCroppedImage(imageRef.current, crop, cropQuality));
      }
    },
    [cropQuality],
  ); // cropper

  const handleCrop = React.useCallback(() => {
    if (typeof onUploadImage === 'function') {
      const newFile: File = dataURIToFile(cropPreview, file.name, {
        type: file.type,
        lastModified: file.lastModified,
      }); // create file to save
      onUploadImage(newFile)
        .then((imageUrl: string) => {
          setDefaultUrl(imageUrl); // update url for preview
          setImage(null); // close modal
          if (typeof onCroppedComplete === 'function')
            onCroppedComplete(imageUrl);
        })
        .catch((error: Error) => {
          notification.error({
            message: translate('components.upload.uploadError'),
            description: error.message,
          });
        });
      return;
    }
    if (typeof onCroppedComplete === 'function') {
      const croppedImage: IImage = {
        url: cropPreview,
        originUrl: cropPreview,
        thumbUrl: cropPreview,
      };
      onCroppedComplete(croppedImage);
      setImage(null); // close modal
    } // if onUploadImage is not a function
  }, [cropPreview, file, onCroppedComplete, onUploadImage, translate]); // crop

  const handleCancelCrop = React.useCallback(() => {
    setImage(null);
    setCropPreview(null);
  }, []); // cancel crop result

  const handleChangeQualityBySlide = React.useCallback(
    debounce((value: SliderValue) => {
      if (typeof value === 'number') setCropQuality(value as number);
      setCropPreview(
        getCroppedImage(imageRef.current, cropper, (value as number) / 100),
      ); // set new default Url
    }),
    [cropper],
  ); // change image quality by slider

  const originalSize = React.useMemo(() => {
    return Math.round((image?.src.length / 1024 / 4) * 3);
  }, [image]);

  const afterCropSize = React.useMemo(() => {
    return Math.round((cropPreview?.length / 1024 / 4) * 3);
  }, [cropPreview]);

  const disableScaleQuality = React.useMemo(() => {
    if (
      getMimeType(source) === 'data:image/png' ||
      getMimeType(source) === 'image/png'
    ) {
      return true;
    }
    return false;
  }, [source]);

  return {
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
  };
}

function getCroppedImage(
  image: HTMLImageElement,
  crop: ReactCrop.Crop,
  quality: number = 1,
): string {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
  if (
    getMimeType(image.src) === 'data:image/jpeg' ||
    getMimeType(image.src) === 'image/jpeg'
  ) {
    return canvas.toDataURL('image/jpeg', quality);
  }
  return canvas.toDataURL('image/png', quality);
}

function getMimeType(src: string) {
  return src?.split(';')[0];
}
