import * as React from 'react';

export interface RenderOptions {
	/**
	 * Output stream where app will be rendered.
	 *
	 * @default process.stdout
	 */
	readonly stdout?: NodeJS.WriteStream;
	/**
	 * Input stream where app will listen for input.
	 *
	 * @default process.stdin
	 */
	readonly stdin?: NodeJS.ReadStream;
	/**
	 * Configure whether Ink should listen to Ctrl+C keyboard input and exit the app. This is needed in case `process.stdin` is in raw mode, because then Ctrl+C is ignored by default and process is expected to handle it manually.
	 *
	 * @default true
	 */
	readonly exitOnCtrlC?: boolean;
	/**
	 * If true, each update will be rendered as a separate output, without replacing the previous one.
	 *
	 * @default false
	 */
	readonly debug?: boolean;
	/**
	 * Enable experimental mode and use a new and faster reconciler and renderer.
	 * There should be no changes to the output. If there are, please report it.
	 *
	 * @default false
	 */
	readonly experimental?: boolean;
}

export type Instance = {
	/**
	 * Replace previous root node with a new one or update props of the current root node.
	 */
	rerender: <Props>(tree: React.ReactElement<Props>) => void;
	/**
	 * Manually unmount the whole Ink app.
	 */
	unmount: Unmount;
	/**
	 * Returns a promise, which resolves when app is unmounted.
	 */
	waitUntilExit: () => Promise<void>;
};

export type Unmount = () => void;

/**
 * This hook is used for handling user input.
 * It's a more convienient alternative to using `StdinContext` and listening to `data` events.
 * The callback you pass to `useInput` is called for each character when user enters any input.
 * However, if user pastes text and it's more than one character, the callback will be called only once and the whole string will be passed as `input`.
 *
 * ```
 * import {useInput} from 'ink';
 *
 * const UserInput = () => {
 *   useInput((input, key) => {
 *     if (input === 'q') {
 *       // Exit program
 *     }
 *
 *     if (key.leftArrow) {
 *       // Left arrow key pressed
 *     }
 *   });
 *
 *   return …
 * };
 * ```
 */
export function useInput(
	inputHandler: (input: string, key: Key) => void
): void;

export interface Key {
	upArrow: boolean
	downArrow: boolean
	leftArrow: boolean
	rightArrow: boolean
	return: boolean
	escape: boolean
	ctrl: boolean
	shift: boolean
	meta: boolean
}

/**
 * Mount a component and render the output.
 */
export function render<Props>(
	tree: React.ReactElement<Props>,
	options?: NodeJS.WriteStream | RenderOptions
): Instance;

export interface ColorProps {
	readonly ansi?: number;
	readonly ansi256?: number;		
	readonly hex?: string;
	readonly hsl?: [number, number, number];
	readonly hsv?: [number, number, number];
	readonly hwb?: [number, number, number];
	readonly rgb?: [number, number, number];
	readonly keyword?: string;
	readonly bgAnsi?: number;
	readonly bgAnsi256?: number;	
	readonly bgHex?: string;
	readonly bgHsl?: [number, number, number];
	readonly bgHsv?: [number, number, number];
	readonly bgHwb?: [number, number, number];
	readonly bgRgb?: [number, number, number];
	readonly bgKeyword?: string;

	readonly reset?: boolean;
	readonly bold?: boolean;
	readonly dim?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	readonly inverse?: boolean;
	readonly hidden?: boolean;
	readonly strikethrough?: boolean;

	readonly visible?: boolean;

	readonly black?: boolean;
	readonly red?: boolean;
	readonly green?: boolean;
	readonly yellow?: boolean;
	readonly blue?: boolean;
	readonly magenta?: boolean;
	readonly cyan?: boolean;
	readonly white?: boolean;
	readonly gray?: boolean;
	readonly grey?: boolean;
	readonly blackBright?: boolean;
	readonly redBright?: boolean;
	readonly greenBright?: boolean;
	readonly yellowBright?: boolean;
	readonly blueBright?: boolean;
	readonly magentaBright?: boolean;
	readonly cyanBright?: boolean;
	readonly whiteBright?: boolean;

	readonly bgBlack?: boolean;
	readonly bgRed?: boolean;
	readonly bgGreen?: boolean;
	readonly bgYellow?: boolean;
	readonly bgBlue?: boolean;
	readonly bgMagenta?: boolean;
	readonly bgCyan?: boolean;
	readonly bgWhite?: boolean;
	readonly bgBlackBright?: boolean;
	readonly bgRedBright?: boolean;
	readonly bgGreenBright?: boolean;
	readonly bgYellowBright?: boolean;
	readonly bgBlueBright?: boolean;
	readonly bgMagentaBright?: boolean;
	readonly bgCyanBright?: boolean;
	readonly bgWhiteBright?: boolean;
}

/**
 * The `<Color>` compoment is a simple wrapper around the `chalk` API. It supports all of the `chalk`'s methods as `props`.
 */
export const Color: React.FC<ColorProps>;

export interface BoxProps {
	readonly width?: number | string;
	readonly height?: number | string;
	readonly minWidth?: number;
	readonly minHeight?: number;
	readonly paddingTop?: number;
	readonly paddingBottom?: number;
	readonly paddingLeft?: number;
	readonly paddingRight?: number;
	readonly paddingX?: number;
	readonly paddingY?: number;
	readonly padding?: number;
	readonly marginTop?: number;
	readonly marginBottom?: number;
	readonly marginLeft?: number;
	readonly marginRight?: number;
	readonly marginX?: number;
	readonly marginY?: number;
	readonly margin?: number;
	readonly flexGrow?: number;
	readonly flexShrink?: number;
	readonly flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	readonly flexBasis?: string | number;
	readonly alignItems?: 'flex-start' | 'center' | 'flex-end';
	readonly justifyContent?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'space-between'
		| 'space-around';
	readonly textWrap?:
		| 'wrap'
		| 'truncate'
		| 'truncate-start'
		| 'truncate-middle'
		| 'truncate-end';
}

/**
 * `<Box>` it's an essential Ink component to build your layout. It's like a `<div style="display: flex">` in a browser.
 */
export const Box: React.ComponentClass<BoxProps>;

export interface TextProps {
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	readonly strikethrough?: boolean;
}

/**
 * This component can change the style of the text, make it bold, underline, italic or strikethrough.
 */
export const Text: React.FC<TextProps>;

/**
 * `<Static>` component allows permanently rendering output to stdout and preserving it across renders. Components passed to `<Static>` as children will be written to stdout only once and will never be rerendered. `<Static>` output comes first, before any other output from your components, no matter where it is in the tree. In order for this mechanism to work properly, at most one `<Static>` component must be present in your node tree and components that were rendered must never update their output. Ink will detect new children appended to `<Static>` and render them to stdout.
 *
 * __Note__: `<Static>` accepts only an array of children and each of them must have a unique key.
 */
export const Static: React.FC<{children: React.ReactNodeArray}>;

interface AppProps {
	/**
	 * Exit (unmount) the whole Ink app.
	 */
	readonly exit: (error?: Error) => void;
}

/**
 * `AppContext` is a React context, which exposes a method to manually exit the app (unmount).
 */
export const AppContext: React.Context<AppProps>;

/**
 * `useApp` is a React hook, which exposes props of `AppContext`.
 * ```js
 * import {useApp} from 'ink';
 *
 * const MyApp = () => {
 *   const {exit} = useApp();
 * };
 * ```
 *
 * It's equivalent to consuming `AppContext` props via `AppContext.Consumer`:
 *
 * ```jsx
 * <AppContext.Consumer>
 *   {({exit}) => {
 *     // …
 *   }}
 * </AppContext.Consumer>
 * ```
 */
export function useApp(): AppProps;

interface StdinProps {
	/**
	 * Stdin stream passed to `render()` in `options.stdin` or `process.stdin` by default. Useful if your app needs to handle user input.
	 */
	readonly stdin: NodeJS.ReadStream;

	/**
	 * A boolean flag determining if the current `stdin` supports `setRawMode`. A component using `setRawMode` might want to use `isRawModeSupported` to nicely fall back in environments where raw mode is not supported.
	 */
	readonly isRawModeSupported: boolean;

	/**
	 * Ink exposes this function via own `<StdinContext>` to be able to handle Ctrl+C, that's why you should use Ink's `setRawMode` instead of `process.stdin.setRawMode`.
	 * If the `stdin` stream passed to Ink does not support setRawMode, this function does nothing.
	 */
	readonly setRawMode: NodeJS.ReadStream['setRawMode'];
}

/**
 * `StdinContext` is a React context, which exposes input stream.
 */
export const StdinContext: React.Context<StdinProps>;

/**
 * `useStdin` is a React hook, which exposes props of `StdinContext`.
 * Similar to `useApp`, it's equivalent to consuming `StdinContext` directly.
 */
export function useStdin(): StdinProps;

interface StdoutProps {
	/**
	 * Stdout stream passed to `render()` in `options.stdout` or `process.stdout` by default.
	 */
	readonly stdout: NodeJS.WriteStream;
}

/**
 * `StdoutContext` is a React context, which exposes stdout stream, where Ink renders your app.
 */
export const StdoutContext: React.Context<StdoutProps>;

/**
 * `useStdout` is a React hook, which exposes props of `StdoutContext`.
 * Similar to `useStdout`, it's equivalent to consuming `StdoutContext` directly.
 */
export function useStdout(): StdoutProps;
