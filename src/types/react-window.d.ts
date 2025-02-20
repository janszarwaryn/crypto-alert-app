declare module 'react-window' {
  import * as React from 'react';

  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
    data: any;
  }

  export interface FixedSizeListProps {
    children: React.ComponentType<ListChildComponentProps>;
    height: number;
    width: number;
    itemCount: number;
    itemSize: number;
    itemKey?: (index: number, data: any) => string | number;
    itemData?: any;
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}

declare module 'react-virtualized-auto-sizer' {
  import * as React from 'react';

  export interface Size {
    height: number;
    width: number;
  }

  export interface AutoSizerProps {
    children: (size: Size) => React.ReactNode;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (size: Size) => void;
    style?: React.CSSProperties;
  }

  const AutoSizer: React.FC<AutoSizerProps>;
  export default AutoSizer;
} 