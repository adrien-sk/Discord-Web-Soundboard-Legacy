import React from 'react';
import { useDrag } from 'react-dnd';

const Library = ({ sound }) => {
	/*const [{ isDragging }, drag] = useDrag({
		item: {
			type: 'user-sound',
			id: sound.id	
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
	});*/

	return(
		<div className="user-sound" ref={drag}>
			{sound.display_name}
		</div>
	);
}

export default Library;