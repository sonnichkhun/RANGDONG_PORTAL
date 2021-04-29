import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { Position } from 'models/Position';

export interface PositionPreviewProps {
  previewModel: Position;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function PositionPreview(props: PositionPreviewProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading } = props;


  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      // size="xl"
      title={previewModel.name}
      statusId={previewModel.statusId}
      code={previewModel.code}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={3}>
          <Descriptions.Item label={translate('positions.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('positions.name')}>
            {previewModel?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('positions.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
