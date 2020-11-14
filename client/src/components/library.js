import React from 'react';
import { useDrop } from 'react-dnd';
import LibrarySound from './librarySound';

const Library = ({ librarySounds, playSound, volumeChangeHandler, removeUserSoundHandler}) => {
	const [{isOver}, drop] = useDrop({
		accept: 'user-sound',
		drop: (item, monitor) => {
			removeUserSoundHandler(item.id)
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	});

	const hoverClass = isOver ? ' hover ' : '';

	return(
		<div className={"library"+hoverClass} ref={drop}>
			<h2>Library</h2>
			<div className="sounds">
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