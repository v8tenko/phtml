import { assertNever, Nullable } from '@v8tenko/utils';

import { CreateVNode, Key, VNodeProps } from '../typings/node';

import { VNode } from './common';
import { Component } from './component';
import { Fragment } from './fragment';
import { PureNode } from './pure';
import './setup';

type TagOrFactory = string | Symbol | CreateVNode;

export const createVNode = (tagOrFactory: TagOrFactory, props?: Nullable<VNodeProps>, key?: Nullable<Key>): VNode => {
	const children = props?.children;

	if (typeof tagOrFactory === 'function') {
		return new Component(tagOrFactory, props, key);
	}

	if (typeof tagOrFactory === 'symbol') {
		return new Fragment(children);
	}

	if (typeof tagOrFactory === 'string') {
		return new PureNode(tagOrFactory, props, children);
	}

	assertNever('Unable to parse node');

	return null as any;
};
