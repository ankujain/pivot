'use strict';
require('./side-drawer.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SvgIcon } from '../svg-icon/svg-icon';
import { List } from 'immutable';
import { $, Expression, Executor, Dataset } from 'plywood';
import { isInside, escapeKey } from '../../utils/dom/dom';
import { DataSource, Clicker, Essence } from '../../../common/models/index';
// import { SomeComp } from '../some-comp/some-comp';


export interface SideDrawerProps {
  clicker: Clicker;
  essence: Essence;
  onClose: Function;
  homeLink?: string;

  key?: string;
}

export interface SideDrawerState {
}

export class SideDrawer extends React.Component<SideDrawerProps, SideDrawerState> {

  constructor() {
    super();
    // this.state = {};
    this.globalMouseDownListener = this.globalMouseDownListener.bind(this);
    this.globalKeyDownListener = this.globalKeyDownListener.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.globalMouseDownListener);
    window.addEventListener('keydown', this.globalKeyDownListener);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.globalMouseDownListener);
    window.removeEventListener('keydown', this.globalKeyDownListener);
  }

  globalMouseDownListener(e: MouseEvent) {
    var myElement = ReactDOM.findDOMNode(this);
    var target = <Element>e.target;

    if (isInside(target, myElement)) return;
    this.props.onClose();
  }

  globalKeyDownListener(e: KeyboardEvent) {
    if (!escapeKey(e)) return;
    this.props.onClose();
  }

  selectDataSource(dataSource: DataSource) {
    var { clicker, onClose } = this.props;
    clicker.changeDataSource(dataSource);
    onClose();
  }

  renderDataSourceItems() {
    var { essence } = this.props;

    var selectedDataSource = essence.dataSource;
    return essence.dataSources.map((dataSource) => {
      return JSX(`
        <li
          className={dataSource === selectedDataSource ? 'selected' : ''}
          key={dataSource.name}
          onClick={this.selectDataSource.bind(this, dataSource)}
        >{dataSource.title}</li>
      `);
    });
  }

  render() {
    var { onClose, homeLink } = this.props;

    var homeLinkElement: React.DOMElement<any> = null;
    if (homeLink) {
      homeLinkElement = JSX(`
        <a className="home-link" href={homeLink}>
          <SvgIcon name="home"/>
          Home
        </a>
      `);
    }

    return JSX(`
      <div className="side-drawer">
        <div className="title" onClick={onClose}>
          <SvgIcon className="combo-logo" name="combo-logo"/>
        </div>
        <ul className="data-sources">
          {this.renderDataSourceItems()}
        </ul>
        {homeLinkElement}
      </div>
    `);
  }
}
