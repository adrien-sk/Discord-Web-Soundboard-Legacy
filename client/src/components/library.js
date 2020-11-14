import React from 'react';
import { useDrop } from 'react-dnd';
import LibrarySound from './librarySound';

const Library = ({ librarySounds, playSound, volumeChangeHandler, removeUserSoundHandler}) => {
	const [{isOver, canDrop}, drop] = useDrop({
		accept: 'user-sound',
		drop: (item, monitor) => {
			removeUserSoundHandler(item.id)
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		})
	});

	const hoverClass = isOver ? ' hover ' : '';
	const canDropClass = canDrop ? ' can-drop ' : '';

	return(
		<div className="library" ref={drop}>
			<h2>Library</h2>
			<div className={"sounds"+hoverClass+canDropClass}>
				{
					librarySounds.map(sound => {
						return <LibrarySound key={sound.id} sound={sound} playSound={playSound} volumeChangeHandler={volumeChangeHandler}/>
					})
				}
			</div>
		</div>
	);
}

export default Library;