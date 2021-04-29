import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { Ward } from 'models/Ward';

export interface WardPreviewProps {
  previewModel: Ward;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function WardPreview(props: WardPreviewProps) {
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
          <Descriptions.Item label={translate('wards.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('wards.name')}>
            {previewModel?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('wards.priority')}>
            {previewModel?.priority}
          </Descriptions.Item>
          <Descriptions.Item label={translate('wards.district')}>
            {previewModel?.district && previewModel.district.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
