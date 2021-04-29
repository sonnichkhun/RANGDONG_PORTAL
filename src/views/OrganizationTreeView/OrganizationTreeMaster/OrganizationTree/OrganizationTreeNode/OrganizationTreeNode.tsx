import { Model } from 'core/models';
import React, { ReactElement } from 'react';
import classNames from 'classnames';
import './OrganizationTreeNode.scss';
import OrganizationTree from '../OrganizationTree';
import { Id } from 'react3l';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
import { API_ORGANIZATION_ROUTE } from 'config/api-consts';
import { crudService } from 'core/services';
export interface TreeNodeProps<T extends Model> {
  className?: string;

  node?: T;

  nodeLevel?: number;

  nodePadding?: number;

  children?: ReactElement<any> | ReactElement<any>[];

  onPreview?(node: T): () => void;

  onAdd?(node: T): () => void;

  onEdit?(id: Id): () => void;

  onDelete?(node: T): () => void;

  onActive?(node: T): void;

  onChange?(value: T[]): void;

  currentItem?: any;

}

function OrganizationTreeNode<T extends Model>(props: TreeNodeProps<T>) {
  const {
    node,
    onAdd,
    onPreview,
    onDelete,
    onEdit,
    onActive,
    children,
    nodeLevel,
    nodePadding,
    currentItem,
  } = props;
  const { validAction } = crudService.useAction('organization', API_ORGANIZATION_ROUTE, 'portal');
  const hasChildren: boolean = node?.children?.length > 0;

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleToggle = React.useCallback(
    () => {
      setIsExpanded(!isExpanded);
    },
    [isExpanded],
  );

  const handleClick = React.useCallback(
    nodeItem => {
      return () => {
        if (onActive) {
          onActive(nodeItem);
        }
      };
    },
    [onActive],
  );


  return (
    <>
      <li
        className={classNames('tree-item', `tree-item-level-${nodeLevel}`, {
          'tree-active': node === currentItem,
        })}
        style={{
          paddingLeft: `${nodePadding}px`,
          width: `${102.7 + nodeLevel * 0.11}%`,
          borderRadius: `3px`,
        }}
        key={node.id}
      >
        <i role="button"
          onClick={handleToggle}
          className={classNames('fa mr-2 node-toggler', {
            show: hasChildren,
            'tio-chevron_right': !isExpanded,
            'tio-chevron_down': isExpanded,
          })}
        />

        <div className="tree-content-wrapper" onClick={handleClick(node)}>
          <Tooltip title={node?.name}>
            <span className="display">{limitWord(node?.name, 70)}</span>
          </Tooltip>
          <div className="actions"
            style={{
              right: 25,
              position: 'absolute',
            }}
          >
            {typeof onPreview === 'function' && (
              <i role="button" className="tio-visible_outlined color-primary " onClick={onPreview(node)} />
            )}
            {typeof onAdd === 'function' && validAction('create') && (
              <i role="button" className="tio-add color-primary" onClick={onAdd(node)} />
            )}
            {typeof onEdit === 'function' && validAction('update') && (
              <i role="button" className="tio-edit color-primary " onClick={onEdit(node.id)} />
            )}
            {typeof onDelete === 'function' && !hasChildren && validAction('delete') && (
              <i role="button" className="tio-delete_outlined color-primary" onClick={onDelete(node)} />
            )}

            {children}
          </div>
        </div>
      </li>
      {hasChildren && (
        <li className="tree-item"
          style={{
            marginLeft: `${nodePadding + 5}px`,
            width: `unset`,
          }}
        >
          <OrganizationTree tree={node.children}
            className={classNames('sub-tree', {
              'expanded': isExpanded,
            },
              'parent-border')}
            parent={node}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onActive={onActive}
            nodeLevel={nodeLevel + 1}
            nodePadding={nodePadding}
            currentItem={currentItem}
          />
        </li>
      )}
    </>
  );
}

OrganizationTreeNode.defaultProps = {
  nodeLevel: 0,
  nodePadding: 12,
  render<T extends Model>(node: T) {
    return node.name;
  },
};

export default OrganizationTreeNode;
