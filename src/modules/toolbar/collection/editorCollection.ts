/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { ToolbarCollection } from './collection';
import { IJodit } from '../../../types/jodit';
import * as consts from '../../../constants';
import { Dom } from '../../Dom';
import { IDictionary, IToolbarButton, IViewBased } from '../../../types';
import { css, isFunction } from '../../helpers';

export class ToolbarEditorCollection extends ToolbarCollection<IJodit> {
	/** @override */
	shouldBeDisabled(button: IToolbarButton): boolean  {
		const disabled = super.shouldBeDisabled(button);

		if (disabled !== undefined) {
			return disabled;
		}

		const mode: number = button.control.mode === undefined
				? consts.MODE_WYSIWYG
				: button.control.mode;

		return !(
			mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode()
		);
	}

	/** @override */
	shouldBeActive(button: IToolbarButton): boolean {
		const active = super.shouldBeActive(button);

		if (active !== undefined) {
			return active;
		}

		const element: false | Node = this.jodit.selection
			? this.jodit.selection.current()
			: false;

		if (!element) {
			return false;
		}

		let elm: Node | false;

		if (button.control.tags) {
			let tags: string[] = button.control.tags;

			elm = element;

			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (
							node &&
							tags.indexOf(node.nodeName.toLowerCase()) !== -1
						) {
							return true;
						}
					},
					this.jodit.editor
				)
			) {
				return true;
			}
		}

		// activate by supposed css
		if (button.control.css) {
			const css = button.control.css;

			elm = element;
			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (node && !Dom.isText(node)) {
							return this.checkActiveStatus(
								css,
								node as HTMLElement
							);
						}
					},
					this.jodit.editor
				)
			) {
				return true;
			}
		}

		return false;
	}

	/** @override */
	getTarget(): Node | void {
		return this.jodit.selection.current() || undefined;
	}

	private checkActiveStatus = (
		cssObject:
			| IDictionary<string | string[]>
			| IDictionary<(editor: IViewBased, value: string) => boolean>,
		node: HTMLElement
	): boolean => {
		let matches: number = 0,
			total: number = 0;

		Object.keys(cssObject).forEach((cssProperty: string) => {
			const cssValue = cssObject[cssProperty];

			if (isFunction(cssValue)) {
				if (cssValue(this.jodit, css(node, cssProperty).toString())) {
					matches += 1;
				}
			} else {
				if (
					cssValue.indexOf(css(node, cssProperty).toString()) !== -1
				) {
					matches += 1;
				}
			}

			total += 1;
		});

		return total === matches;
	};
}