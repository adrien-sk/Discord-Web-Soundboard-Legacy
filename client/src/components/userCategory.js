import  React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import UserSound from './userSound';

const UserCategory = ({ category, onUpdateSound, playSound, onUpdateCategoryName, onDeleteCategory }) => {
	const [{isOver}, drop] = useDrop({
		accept: ['user-sound', 'library-sound'],
		drop: (item, monitor) => onUpdateSound(item.type, item.id, category.id),
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	});

	const [categoryName, setCategoryName] = useState(category.name);

	const hoverClass = isOver ? ' hover ' : '';

	const focusOutOfCategoryName = (e) => {
		let newCategoryName = e.target.value !== '' ? e.target.value : 'NoName Category';
		setCategoryName(newCategoryName);
		onUpdateCategoryName(category.id, newCategoryName);
	}

	return(
		<div className="user-category">
			<input type="text" name="title" onChange={e => setCategoryName(e.target.value)} value={categoryName} onBlur={e => focusOutOfCategoryName(e)} className="form-control" />
			<div className={"user-sounds"+hoverClass} ref={drop}>
				{
					category.sounds.map(sound => {
						return <UserSound key={sound.id} playSound={playSound} sound={sound} />
					})
				}
			</div>
			<div className="delete-category"><i className="far fa-trash-alt" onClick={() => onDeleteCategory(category.id)}></i></div>
		</div>
	);
}

export default UserCategory;