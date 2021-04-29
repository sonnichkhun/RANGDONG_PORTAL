import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { District } from 'models/District';

export interface DistrictPreviewProps {
  previewModel: District;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function DistrictPreview(props: DistrictPreviewProps) {
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
          <Descriptions.Item label={translate('districts.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('districts.name')}>
            {previewModel?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('districts.priority')}>
            {previewModel?.priority}
          </Descriptions.Item>
          <Descriptions.Item label={translate('districts.province')}>
            {previewModel?.province && previewModel.province.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
