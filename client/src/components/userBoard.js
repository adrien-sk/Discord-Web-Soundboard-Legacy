import React from 'react';
import UserCategory from './userCategory';

const UserBoard = ({ userSounds, onUpdateSound, playSound, onAddUserCategory, onUpdateCategoryName, onDeleteCategory }) => {

	return(
		<div className="user-categories">
			{ 
				userSounds.map(category => {
					return <UserCategory key={category.id} category={category} onUpdateSound={onUpdateSound} playSound={playSound} onUpdateCategoryName={onUpdateCategoryName} onDeleteCategory={onDeleteCategory} />
				})
			}
			<div className="new-category" onClick={onAddUserCategory}><i className="fas fa-plus"></i></div>
		</div>
	);
}

export default UserBoard;