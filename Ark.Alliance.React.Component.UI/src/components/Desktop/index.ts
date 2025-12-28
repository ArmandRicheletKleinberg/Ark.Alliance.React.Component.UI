/**
 * Desktop Component Family Exports
 * @module components/Desktop
 * 
 * BwarkOS-inspired desktop UI components including windows,
 * taskbar, start menu, and desktop icons.
 */

// Types
export * from './types';

// WindowPanel
export { WindowPanel, type WindowPanelProps } from './WindowPanel';
export { useWindowPanel, type UseWindowPanelOptions, type UseWindowPanelResult, type ResizeDirection } from './WindowPanel';
export { WindowPanelModelSchema, type WindowPanelModel, defaultWindowPanelModel, createWindowPanelModel } from './WindowPanel';

// DesktopIcon
export { DesktopIcon, type DesktopIconProps } from './DesktopIcon';
export { useDesktopIcon, type UseDesktopIconOptions, type UseDesktopIconResult } from './DesktopIcon';
export { DesktopIconModelSchema, type DesktopIconModel, defaultDesktopIconModel, createDesktopIconModel } from './DesktopIcon';

// Taskbar
export { Taskbar, type TaskbarProps } from './Taskbar';
export { useTaskbar, type UseTaskbarOptions, type UseTaskbarResult } from './Taskbar';
export { TaskbarModelSchema, type TaskbarModel, type TaskbarWindow, defaultTaskbarModel, createTaskbarModel } from './Taskbar';

// StartMenu
export { StartMenu, type StartMenuProps } from './StartMenu';
export { useStartMenu, type UseStartMenuOptions, type UseStartMenuResult } from './StartMenu';
export { StartMenuModelSchema, type StartMenuModel, type StartMenuApp, defaultStartMenuModel, createStartMenuModel } from './StartMenu';

// DesktopPage
export { DesktopPage, type DesktopPageProps, type AppComponentRenderer } from './DesktopPage';
export { useDesktopPage, type UseDesktopPageOptions, type UseDesktopPageResult } from './DesktopPage';
export {
    DesktopPageModelSchema,
    DesktopTheme,
    BackgroundType,
    THEME_PRESETS,
    type DesktopPageModel,
    type DesktopThemeType,
    type BackgroundConfig,
    defaultDesktopPageModel,
    createDesktopPageModel
} from './DesktopPage';
