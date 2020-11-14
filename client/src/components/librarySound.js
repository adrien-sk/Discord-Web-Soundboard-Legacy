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
			<span className="sound btn" ref={drag} onClick={() => playSound(sound)}>
				{sound.display_name}
				{/* <input data-name={sound.file_name} type="range" min="0" max="40" defaultValue='10' className="slider" onChange={volumeChangeHandler} /> */}
			</span>
	);
}

export default LibrarySound;