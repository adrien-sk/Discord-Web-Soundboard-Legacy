import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import UserSound from './userSound';

const UserCategory = ({ category, onUpdateSound }) => {
	const [{isOver}, drop] = useDrop({
		accept: 'user-sound',
		drop: (item, monitor) => onUpdateSound(item.id, category.id),
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	});

	const hoverClass = isOver ? ' hover ' : '';

	return(
		<div className="user-category">
			<p>{category.name}</p>
			<div className={"user-sounds"+hoverClass} ref={drop}>
				{
					category.sounds.map(sound => {
						return <UserSound key={sound.id} sound={sound} />
					})
				}
			</div>
		</div>
	);
}

export default UserCategory;