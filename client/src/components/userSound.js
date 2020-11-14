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
	//console.log(sound);

	return(
		<button className="sound btn" ref={drag} onClick={() => playSound(sound)}>{sound.display_name}</button>
	);
}

export default UserSound;