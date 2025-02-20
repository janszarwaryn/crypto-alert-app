declare module 'react-virtualized' {
  import * as React from 'react';

  export interface Size {
    height: number;
    width: number;
  }

  export interface ListRowProps {
    index: number;
    key: string | number;
    style: React.CSSProperties;
    isScrolling?: boolean;
    isVisible?: boolean;
  }

  export interface ListProps {
    height: number;
    width: number;
    rowCount: number;
    rowHeight: number | ((params: { index: number }) => number);
    rowRenderer: (props: ListRowProps) => React.ReactNode;
    overscanRowCount?: number;
    onScroll?: (params: { clientHeight: number; clientWidth: number; scrollHeight: number; scrollLeft: number; scrollTop: number; scrollWidth: number }) => void;
    scrollToIndex?: number;
    scrollTop?: number;
  }

  export class List extends React.Component<ListProps> {}

  export interface AutoSizerProps {
    children: (size: Size) => React.ReactNode;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (size: Size) => void;
    style?: React.CSSProperties;
  }

  export class AutoSizer extends React.Component<AutoSizerProps> {}
} 