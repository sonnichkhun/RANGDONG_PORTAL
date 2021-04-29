import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { Province } from 'models/Province';

export interface ProvincePreviewProps {
  previewModel: Province;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function ProvincePreview(props: ProvincePreviewProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading } = props;


  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      code={previewModel.code}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('provinces.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('provinces.name')}>
            {previewModel?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('provinces.priority')}>
            {previewModel?.priority}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
