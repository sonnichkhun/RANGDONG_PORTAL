import React, { Dispatch, SetStateAction } from 'react';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import nameof from 'ts-nameof.macro';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { tableService } from 'services';
import { useTranslation } from 'react-i18next';

import { PermissionPageMapping } from 'models/PermissionPageMapping';
import { Page } from 'models/Page';
import { PageFilter } from 'models/PageFilter';

export interface PermissionPageMappingModalProps extends ModalProps {
  current: PermissionPageMapping[];

  loading: boolean;

  modelFilter: PageFilter;

  setModelFilter: Dispatch<SetStateAction<PageFilter>>;

  rowSelection: TableRowSelection<Page>;

  list: PermissionPageMapping[];

  total: number;

  onClose: () => void;
}

function PermissionPageMappingMappingModal(
  props: PermissionPageMappingModalProps,
) {
  const [translate] = useTranslation();

  const {
    isOpen,
    toggle,
    onClose,
    list,
    loading,
    rowSelection,
    modelFilter,
    setModelFilter,
    total,
  } = props;

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    modelFilter,
    setModelFilter,
    total,
  );

  const columns: ColumnProps<PermissionPageMapping>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PermissionPageMapping>(pagination),
      },
      {
        key: nameof(list[0].id),
        dataIndex: nameof(list[0].id),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('permissions.pages.id'),
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('permissions.pages.name'),
      },
      {
        key: nameof(list[0].path),
        dataIndex: nameof(list[0].path),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('permissions.pages.path'),
      },
      {
        key: nameof(list[0].menuId),
        dataIndex: nameof(list[0].menuId),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('permissions.pages.menuId'),
      },
      {
        key: nameof(list[0].isDeleted),
        dataIndex: nameof(list[0].isDeleted),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('permissions.pages.isDeleted'),
      },
    ];
  }, [list, pagination, sorter, translate]);

  return (
    <Modal size="xl" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={onClose}>
          {translate(generalLanguageKeys.actions.close)}
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default PermissionPageMappingMappingModal;
