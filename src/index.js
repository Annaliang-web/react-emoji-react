import React, { Component } from 'react';
import emoji from './all-emoji';

const wrapperStyle = {
	display: 'inline-block',
	marginTop: 2,
	marginBottom: 2,
	marginRight: 4,
	padding: '1px 3px',
	borderRadius: 5,
	backgroundColor: '#fff',
	border: '1px solid #E8E8E8',
	cursor: 'pointer',
	height: '1.4rem',
	lineHeight: '23px',
	WebkitUserSelect: 'none',
	msUserSelect: 'none',
	MozUserSelect: 'none'
};

const emojiStyle = {
	lineHeight: '20px',
	verticalAlign: 'middle',
	display: 'inline-block'
};

const wrapperHover = {
	border: '1px solid #4fb0fc'
};

const countStyle = {
	fontSize: 11,
	fontFamily: 'helvetica, arial',
	position: 'relative',
	top: -2,
	padding: '0 1px 3px',
	color: '#959595'
};

const countHover = {
	color: "#4fb0fc"
};

const selectorStyle = {
	boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.24)',
	backgroundColor: '#fff',
	width: 250,
	height: 150,
	overflow: 'auto',
	position: 'relative',
	left: 10,
	top: 0
};

const EmojiImage = ({name}) => <img style={{width: 16, height: 16}} src={require(`./emoji/${name}.png`)} />;

class SingleEmoji extends Component {
	constructor() {
		super();
		this.state = { hovered: false };
	}

	render() {
		const { 
			name, 
			count = 1, 
			styles = {
				wrapperStyle: wrapperStyle, 
				emojiStyle: emojiStyle, 
				countStyle: countStyle,
				wrapperHover: wrapperHover,
				countHover: countHover
			}, 
			onClick = () => {}
		} = this.props;

		const wrapperFinalStyle = this.state.hovered ? {...wrapperStyle, ...wrapperHover} : wrapperStyle;
		const countFinalStyle = this.state.hovered ? {...countStyle, ...countHover} : countStyle;
		return (
			<div 
				style={wrapperFinalStyle} 
				onClick={() => onClick(name)} 
				onMouseEnter={() => this.setState({hovered: true})}
				onMouseLeave={() => this.setState({hovered: false})}
			>
				<span style={emojiStyle}><EmojiImage name={name} /></span>
				<span style={countFinalStyle}>{count}</span>
			</div>
		);
	}
}

const EmojiWrapper = ({reactions, onReaction}) => {
	return (
		<div style={{display: 'inline-block'}}>
			{reactions.map(({name, count}) => (
				<SingleEmoji name={name} count={count} key={name} onClick={onReaction} />
			))}
		</div>
	);
}

class EmojiSelector extends Component {
	constructor() {
		super();
		this.state = { filter: "", xHovered: false };
	}

	render() {
		const { showing, onEmojiClick, close } = this.props;
		if (!showing) {
			return null;
		}
		let xStyle = {
			color: '#E8E8E8', 
			fontSize: 20,
			cursor: 'pointer', 
			float: 'right', 
			marginTop: -32,
			marginRight: 5 
		};
		if (this.state.xHovered) {
			xStyle.color = '#4fb0fc';
		}
		const searchInput = (
			<div>
				<input 
					style={{margin: 10, width: '85%', borderRadius: 5, border: '1px solid #E8E8E8'}}
					type='text' 
					placeholder='Search'
					value={this.state.filter} 
					onChange={(e) => this.setState({filter: e.target.value})}
				/>
			</div>
		);
		const x = (
			<span 
				style={xStyle}
				onClick={() => {
					this.setState({ xHovered: false});
					close();
				}}
				onMouseEnter={() => this.setState({ xHovered: true})}
				onMouseLeave={() => this.setState({ xHovered: false})}
			> 
				x
			</span>
		);
		const show = emoji.filter(name => name.indexOf(this.state.filter) !== -1);
		const emojis = show.map(em => {
			return (
				<span 
					style={{cursor: 'pointer', padding: 5}} 
					key={em}
					onClick={() => {
						onEmojiClick(em)
						close();
					}}
				>
					<EmojiImage name={em} />
				</span>
			);
		});
		return (
			<div style={selectorStyle}>
				{searchInput}
				{x}
				<div style={{padding: 15, paddingTop: 5, width: '90%'}}>
					{emojis}
				</div>
			</div>
		);
	}
}

export default class EmojiReact extends Component {
	constructor() {
		super();
		this.state = { hovered: false, showSelector: false };
		this.onKeyPress = this.onKeyPress.bind(this);
		this.closeSelector = this.closeSelector.bind(this);
	}

	onKeyPress(e) {
		if (e.keyCode === 27) {
			this.closeSelector();
		}
	}

	componentDidMount() {
		document.addEventListener('keydown', this.onKeyPress);
	}

	componentWillUnMount() {
		document.removeEventListener('keydown', this.onKeyPress);
	}

	closeSelector() {
		this.setState({ showSelector: false });
	}

	render() {
		const { reactions, onReaction, onEmojiClick } = this.props;
		const plusButtonStyle = this.state.hovered ? {...wrapperStyle, ...wrapperHover} : wrapperStyle;
		const plusStyle = this.state.hovered ? {...countStyle, ...countHover} : countStyle;
		const selector = (
			<div style={{display: 'inline-block'}}>
				<div 
					style={plusButtonStyle}
					onMouseEnter={() => this.setState({ hovered: true })}
					onMouseLeave={() => this.setState({ hovered: false})	}
					onClick={() => this.setState({ showSelector: !this.state.showSelector})}
				>
					<span style={plusStyle}>+</span>
				</div>
				<EmojiSelector 
					showing={this.state.showSelector} 
					onEmojiClick={onEmojiClick} 
					close={this.closeSelector}
				/>
			</div>
		);
		return (
			<div style={{display: 'inline-flex'}}>
				<EmojiWrapper onReaction={onReaction} reactions={reactions} />
				{selector}
			</div>
		);
	}
}
