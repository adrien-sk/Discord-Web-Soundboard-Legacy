import React from 'react';
import UserCategory from './userCategory';

const UserBoard = ({ userSounds, onUpdateSound }) => {

	return(
		<div className="user-categories">
			{ 
				userSounds.map(category => {
					return <UserCategory key={category.id} category={category} onUpdateSound={onUpdateSound}/>
				})
			}
		</div>
	);
}

export default UserBoard;