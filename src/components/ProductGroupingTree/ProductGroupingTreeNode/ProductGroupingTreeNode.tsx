import { Model } from 'core/models';
import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import './ProductGroupingTreeNode.scss';
import ProductGroupingTree from 'components/ProductGroupingTree/ProductGroupingTree';
import { Tooltip } from 'antd';

export interface TreeNodeProps<T extends Model> {
  className?: string;

  node?: T;

  nodeLevel?: number;

  nodePadding?: number;

  children?: ReactElement<any> | ReactElement<any>[];

  onPreview?(node: T): () => void;

  onAdd?(node: T): () => void;

  onEdit?(node: T): () => void;

  onDelete?(node: T): () => void;

  onActive?(node: T): void;

  onChange?(value: T[]): void;

  render?(node: T): ReactNode;

  currentItem?: any;
}

function ProductGroupingTreeNode<T extends Model>(props: TreeNodeProps<T>) {
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
  const hasChildren: boolean = node?.children?.length > 0;

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleToggle = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleClick = React.useCallback(
    nodeItem => {
      if (onActive) {
        onActive(nodeItem);
      }
    },
    [onActive],
  );

  const handleSliceName = React.useCallback(
    (name: string) => {
      if (name.length > 50) {
        return name.slice(0, 50) + '...';
      }
      else {
        return name;
      }
    },
    [],
  );

  return (
    <>
      <li
        className={classNames('tree-item', `tree-item-level-${nodeLevel}`, {
          'tree-active': node === currentItem,
        })}
        style={{
          paddingLeft: `${nodeLevel * nodePadding}px`,
        }}
        key={node.id}
      >
        <i
          role="button"
          onClick={handleToggle}
          className={classNames('fa mr-2 node-toggler', {
            show: hasChildren,
            'fa-caret-right': !isExpanded,
            'fa-caret-down': isExpanded,
          })}
        />
        <div className="tree-content-wrapper" onClick={() => handleClick(node)}>
          {
            node?.name.length > 50 && (
              <Tooltip placement="topLeft" title={node?.name}>
                <span className="display"> {handleSliceName(node?.name)} </span>
              </Tooltip>
            )
          }
          {
            node?.name.length <= 50 && (
              <span className="display"> {handleSliceName(node?.name)} </span>
            )
          }
          <div className="actions mr-2">
            {typeof onPreview === 'function' && (
              <i
                role="button"
                className="icon fa fa-eye"
                onClick={onPreview(node)}
              />
            )}
            {typeof onAdd === 'function' && (
              <i
                role="button"
                className="icon fa fa-plus"
                onClick={onAdd(node)}
              />
            )}
            {typeof onEdit === 'function' && (
              <i
                role="button"
                className="icon fa fa-edit"
                onClick={onEdit(node)}
              />
            )}
            {typeof onDelete === 'function' && !hasChildren && (
              <i
                role="button"
                className="icon fa fa-trash"
                onClick={onDelete(node)}
              />
            )}

            {children}
          </div>
        </div>
      </li>
      {hasChildren && (
        <li className={classNames('tree-item')} key={node.id + 1}>
          <ProductGroupingTree
            tree={node.children}
            className={classNames('sub-tree', {
              expanded: isExpanded,
            },
            )}
            parent={node}
            onAdd={onAdd}
            onEdit={onEdit}
            onPreview={onPreview}
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

ProductGroupingTreeNode.defaultProps = {
  nodeLevel: 0,
  nodePadding: 12,
  render<T extends Model>(node: T) {
    return node.name;
  },
};

export default ProductGroupingTreeNode;
