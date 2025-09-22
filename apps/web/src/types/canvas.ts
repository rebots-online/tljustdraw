import type {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawElement,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types';

export interface ExcalidrawSnapshot {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

export type CanvasAPI = ExcalidrawImperativeAPI;

export type { AppState, BinaryFileData, BinaryFiles, ExcalidrawElement, ExcalidrawImperativeAPI };
