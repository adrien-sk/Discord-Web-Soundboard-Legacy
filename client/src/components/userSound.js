import React from 'react';
import { useDrag } from 'react-dnd';

const UserSound = ({ sound }) => {
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
		<div className="user-sound" ref={drag}>
			{sound.display_name}
		</div>
	);
}

export default UserSound;