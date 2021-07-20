import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';

class UserAvatar extends Component {
	render () {
		const { size, round } = this.props;
		const { user } = this.props.user;
		let name = '';

		if (!user) {
			return null;
		}

		if (user.firstName) {
			name += (user.firstName + ' ');
		}

		if (user.lastName) {
			name += user.lastName;
		}

		if (!user.profileImage) {
			return <Avatar name={name} size={size} round={round} />
		}

		return <div style={{
			width: size,
			height: size,
			borderRadius: (round ? '100%' : 0),
			margin: 'auto',
			backgroundSize: 'cover',
			backgroundImage: `url(${user.profileImage})`,
		}} />;
	}
}

const mapStateToProps = state => ({
	user: state.user,
});

export default connect(mapStateToProps)(UserAvatar);
