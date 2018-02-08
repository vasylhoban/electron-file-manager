
import React, { Component } from 'react';
import { remote } from 'electron';
import _ from 'lodash';

const { Menu, MenuItem } = remote;

class FileExplorerTree extends Component {
	constructor(props) {
		super(props);

		this.menu = null;
		this.clickedPath = null;
	}

	componentWillMount() {
		this.menu = new Menu();
		this.menu.append(new MenuItem({
				label: 'Copy',
				click: () => {
					this.props.copyRequest(this.clickedPath);
					this.menu.items[4].enabled = true;
				}})
		);
		this.menu.append(new MenuItem({type: 'separator'}));
		this.menu.append(new MenuItem({
			label: 'Move',
			click: () => {
				this.props.moveRequest(this.clickedPath);
				this.menu.items[4].enabled = true;
			}})
		);
		this.menu.append(new MenuItem({type: 'separator'}));
		this.menu.append(new MenuItem({
			label: 'Paste',
			enabled: _.some(this.props.copyMovePaths, _.isEmpty),
			click: () => {
				const { toCopy, toMove } = this.props.copyMovePaths;
				this.props.pasteRequest(toCopy || toMove, this.clickedPath,  toCopy ? 'copy' : 'move');
			}})
		);
	}

	updateCurrentPath(folder) {
		!folder.isFile && this.props.updateCurrentPath(`${this.props.currentPath}${folder.title}/`);
	}

	contextMenu(folder) {
		this.clickedPath = folder;
		this.menu.popup(remote.getCurrentWindow());
	}

	renderFolders() {
		return _.map(this.props.treeData, folder => {
			return <a className="collection-item avatar root-item"
								onContextMenu={() => {
									this.contextMenu(folder)
								}}
								onClick={() => {this.updateCurrentPath(folder)}}
								key={folder.title}>
				<i className="material-icons circle light-green darken-2">{folder.isFile ? 'insert_drive_file' : 'folder'}</i>
				{folder.title}</a>
		});
	}

	renderEmptyFolder() {
		return <h2 className="center-align">Folder is empty</h2>;
	}

	renderExplorer() {
		if (this.props.treeData && this.props.treeData.length) {
			return <div className="collection">{this.renderFolders()}</div>
		}

		return <div>{this.renderEmptyFolder()}</div>;
	}


	render() {
		return (
			<div>
				{this.renderExplorer()}
			</div>
		);
	}
}
export default FileExplorerTree;
