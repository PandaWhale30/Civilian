import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { BsBoxArrowRight, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { IconContext } from 'react-icons';
import Comment from './Comment'

const YT_EMBED_OPTIONS = 'loop=1&autoplay=1&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0';

console.log('in ExpandedPost.jsx');

// we are destructuring the state to get the title, loc, details, time from
// the redux state and placing them into the props object
// The Post component "subscribes to" the changes seen in the state
const mapStateToProps = ({
  posts:{ title, street_name, details, time, video_url, incident_id, comments }, 
  user: {userID, userComment, isLoggedIn, photo}
}) => ({
  title,
  street_name,
  details,
  time,
  video_url,
  incident_id,
  comments,
  userID,
  userComment,
  isLoggedIn,
  photo,
});

// allows us to use the actions in actions.js without having to wrap them so that we can invoke those functions
// directly even though they were not created in this page
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const ExpandedPost = (props) => {
  const comments = props.comments.map((item, id) => {
    return <Comment comment={item.comment} time={item.created_on} name={item.name} photo={item.photo} key={id}/>
  });
  // console.log(comments, 'heresscomments');
  return (
    <div className='expanded-post'>
      <IconContext.Provider value={{className: 'minimize-expanded', size:'1.5rem'}}>
        <BsBoxArrowRight onClick={() => props.setExpandedPost(false)}/>
      </IconContext.Provider>
      <div id='expanded-header' className='post-header'>
        <p className='post-title'> {props.title} </p>
        <p className='post-location'> {props.street_name} </p>
        <p className='post-details'> {props.details} </p>
        <p className='post-time'> {props.time} </p>
      </div> 
      {props.video_url  && 
      <div className='post-video'>
        <iframe id="yt-vid" src={props.video_url + YT_EMBED_OPTIONS} frameBorder="0">
        </iframe>
      </div>}
      <div className='comment-container'>
        <p className='heading-comment'>Recent Comments</p>
        <div className='all-comments'>
          {comments}
        </div>
        {props.isLoggedIn && 
          <form className = 'post-comment-container'>
            <input className='comment-input' type='text' placeholder='Leave a comment' value={props.userComment} onChange={(e) => props.fillComment(e.target.value)}/>
            <IconContext.Provider value={{className: 'post-comment-button', size:'1.5rem'}}>
              <BsFillArrowUpCircleFill onClick={() => props.postCommentOnIncident(props.incident_id, props.userID, props.userComment, props.photo)}/>
            </IconContext.Provider>
          </form>
        }
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedPost);