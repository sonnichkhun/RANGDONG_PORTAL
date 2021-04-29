import Button, { ButtonType } from 'antd/lib/button';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ITreeItem } from 'helpers/tree';
import { Model, ModelFilter } from 'core/models';
import { useTranslation } from 'react-i18next';
import Tree from 'components/TreeMap/TreeMap';
import { AxiosError } from 'axios';

export interface ISelectedItems<T> {
  [key: number]: T;
}

interface ITreeInModalProps<T extends Model, TModelFilter extends ModelFilter> {
  defaultSelectedItems?: T[];

  selectedItems?: T[];

  defaultDataSource?: ITreeItem[];

  visible?: boolean;

  onChange?: (selectedItem: T[]) => void;

  onClose?: (event) => void;

  title?: string;

  className?: string;

  allowOk?: boolean;

  okText?: string;

  okType?: ButtonType;

  allowClose?: boolean;

  closeText?: string;

  closeType?: ButtonType;

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  list?: T[];

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  onSearchError?: (error: AxiosError<T>) => void;

  searchField?: string;
}

const TreePopup = <T extends Model, TModelFilter extends ModelFilter>(
  props: ITreeInModalProps<T, TModelFilter>,
) => {
  const {
    modelFilter,
    getList,
    list: defaultList,
    // onSearchError,
    // searchField,
    onChange,
  } = props;

  const [translate] = useTranslation();

  const [selectedItems, setSelectedItems] = useState<T[]>(
    props.selectedItems || props.defaultSelectedItems || [],
  );

  const [list, setList] = React.useState<T[]>(defaultList ?? []);

  const [, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.selectedItems) {
      setSelectedItems(props.selectedItems);
    }
  }, [props.selectedItems]);

  const handleOk = React.useCallback(() => {
    if (onChange) {
      onChange(selectedItems);
      return;
    }
  }, [selectedItems, onChange]);
  const handleLoadList = React.useCallback(async () => {
    try {
      setLoading(true);
      setList(await getList(modelFilter));
    } catch (error) {
      // if (typeof onSearchError === 'function') {
      //   onSearchError(error);
      // }
    }
    setLoading(false);
  }, [getList, modelFilter]);

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const handleClose = React.useCallback(
    event => {
      setSelectedItems(props.selectedItems || props.defaultSelectedItems || []);
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  const handleChangeTree = React.useCallback(
    item => {
      const index: number = selectedItems.indexOf(item);
      if (index < 0) {
        selectedItems.push(item);
      } else {
        selectedItems.splice(index, 1);
      }
      setSelectedItems(selectedItems);
    },
    [selectedItems],
  );

  return renderModal();

  function renderModal() {
    return (
      <>
        <Modal
          className={props.className}
          isOpen={props.visible}
          toggle={handleClose}
          size="xl"
          style={{ maxWidth: '1000px', width: '90%' }}
          unmountOnClose
          centered
        >
          <ModalHeader toggle={props.onClose}>
            {translate(props.title)}
          </ModalHeader>
          <ModalBody>
            <Tree
              selectedItems={selectedItems}
              onChange={handleChangeTree}
              value={list}
              isEdit={false}
              checkable={true}
            />
          </ModalBody>
          <ModalFooter>
            <Button htmlType="button" type={props.okType} onClick={handleOk}>
              {translate(props.okText)}
            </Button>
            <Button
              htmlType="button"
              type={props.closeType}
              onClick={handleClose}
            >
              {translate(props.closeText)}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
};

TreePopup.defaultProps = {
  allowOk: true,
  okText: 'OK',
  okType: 'primary',
  allowClose: true,
  closeText: 'Cancel',
  closeType: 'default',
  defaultDataSource: [],
};

export default TreePopup;
