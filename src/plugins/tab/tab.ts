/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/tab/README.md]]
 * @packageDocumentation
 * @module plugins/tab
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { watch } from 'jodit/core/decorators';
import { KEY_TAB } from 'jodit/core/constants';
import { pluginSystem } from 'jodit/core/global';

import { onTabInsideLi } from './cases';
import './config';

class tab extends Plugin {
	protected afterInit(jodit: IJodit): void {}

	@watch(':keydown.tab')
	protected __onTab(event: KeyboardEvent): false | void {
		if (event.key === KEY_TAB && onTabInsideLi(this.j, event.shiftKey)) {
			return false;
		}
	}

	@watch(':beforeCommand.tab')
	protected __onCommand(command: string): false | void {
		if (
			(command === 'indent' || command === 'outdent') &&
			onTabInsideLi(this.j, command === 'outdent')
		) {
			return false;
		}
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

pluginSystem.add('tab', tab);
