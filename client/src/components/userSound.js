import React from 'react';
import { useDrag } from 'react-dnd';

const UserSound = ({ sound, playSound }) => {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: 'user-sound',
			id: sound.user_sound_id	
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
	});

	const isDraggingClass = isDragging ? ' is-dragging ' : '';

	return(
		<span className={'sound btn'+isDraggingClass} ref={drag} onClick={() => playSound(sound)}>{sound.display_name}</span>
	);
}

export default UserSound;