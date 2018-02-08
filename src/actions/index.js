import { ipcRenderer } from 'electron';
import {
	LEVEL_DATA_REQUEST,
	LEVEL_DATA_RECEIVED,
	COPY_REQUEST,
	MOVE_REQUEST,
	PASTE_REQUEST,
	PASTE_REQUEST_DONE
} from "./types";

export const levelDataListenerOn = () => dispatch => {
	ipcRenderer.on('LEVEL_DATA_SEND', (event, {files, path}) => {
		dispatch({
			type: LEVEL_DATA_RECEIVED,
			path,
			payload: files
		});
	});
};

export const levelDataRequest = path => dispatch => {
	ipcRenderer.send('LEVEL_DATA_REQUEST', path);
	dispatch({
		type: LEVEL_DATA_REQUEST,
		path
	});
};

export const copyRequest = path => dispatch => {
	dispatch({
		type: COPY_REQUEST,
		path
	});
};

export const moveRequest = path => dispatch => {
	dispatch({
		type: MOVE_REQUEST,
		path
	});
};

export const pasteRequest = (path, dest, pasteType) => dispatch => {
	ipcRenderer.send('DATA_PASTE_REQUEST', {
		path,
		dest,
		pasteType
	});
	dispatch({
		type: PASTE_REQUEST,
		path,
		status: 'inprogress'
	});
};

export const pasteDoneListenerOn = (path, dest, pasteType) => dispatch => {
	ipcRenderer.on('PASTE_REQUEST_DONE', () => {
		dispatch({
			type: PASTE_REQUEST_DONE,
			status: 'done'
		});
	});
};

export const saveDestPath = path => dispatch => {
	dispatch({
		type: SAVE_DEST_PATH,
		dest: path
	});
};