import React from 'react';
import { useDrag } from 'react-dnd';

const LibrarySound = ({ sound, playSound, volumeChangeHandler }) => {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: 'library-sound',
			id: sound.id
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
	});

	return(
		<div className="library-sound sound-wrapper" ref={drag}>
			<button className="sound btn" onClick={() => playSound(sound)}>{sound.display_name}</button>
			{/* <input data-name={sound.file_name} type="range" min="0" max="40" defaultValue='10' className="slider" onChange={volumeChangeHandler} /> */}
		</div>
	);
}

export default LibrarySound;