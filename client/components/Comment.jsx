import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { bindActionCreators } from 'redux';

console.log('in Comment.jsx');



const Comment = (props) => {
  return (
    <div className='comment-box'>
      <img className='comment-img' src={props.photo} alt="profile-pic"/>
      <div id='comment-details'>
        <div className='comment-header'>
          <p className='comment-name'> {props.name} </p>
          <p className='comment-time'> {props.time} </p>
        </div>
        <p className='comment-text'> {props.comment} </p>
      </div>
    </div>
  );
}

export default Comment;