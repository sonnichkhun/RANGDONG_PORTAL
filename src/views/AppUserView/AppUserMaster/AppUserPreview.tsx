import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { AppUser } from 'models/AppUser';

export interface AppUserPreviewProps {
  previewModel: AppUser;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function AppUserPreview(props: AppUserPreviewProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading } = props;


  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.displayName}
      code={previewModel.username}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('appUsers.address')}>
            {previewModel?.address}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.sex')}>
            {previewModel?.sex?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.position')}>
            {previewModel?.position?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.province')}>
            {previewModel?.province?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.email')}>
            {previewModel?.email}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.phone')}>
            {previewModel?.phone}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
