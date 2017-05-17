import React from 'react';
import FluxibleMixin from 'fluxible-addons-react/FluxibleMixin';
import UserBar from './UserBar';
// import { BlogActions } from '../../actions';
import { UserStore, BlogStore } from '../../stores';
import { UserHomeNav, HomeRightNav } from '../UserNavs';
import { PinItem, ModalsFactory, Layout } from '../UI';
import { PinItemModal } from '../UserControls';
import { sweetAlert, jsUtils } from '../../utils';

const UserHome = React.createClass({

  displayName: 'UserHome',

  contextTypes: {
    executeAction: React.PropTypes.func,
  },

  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [UserStore, BlogStore]
  },

  getInitialState() {
    return this.getStatesFromStores();
  },

  getStatesFromStores() {
    const { username } = this.props.params;
    return {
      currentUser: this.getStore(UserStore).getCurrentUser(),
      user: this.getStore(UserStore).getUserByUsername(username),
      displayBlogs: this.getStore(UserStore).getDisplayBlogsByUsername(username),
      selectedPin: {},
      singleUserBlogs: null,
      welcomeText: 'What happened today, Write a blog here !',
      showCreateModal: false
    };
  },

  onChange(res) {
    const { user, displayBlogs } = this.state;
    const { username } = this.props.params;
    if (res.msg === 'CREATE_BLOG_SUCCESS') {
      sweetAlert.success(res.msg);
      displayBlogs.push(res.newBlog);
      this.setState({ displayBlogs });
      ModalsFactory.hide('createBlogModal');
    }

    if (res.msg === 'COMMENT_SUCCESS'
        || res.msg === 'DELETE_COMMENT_SUCCESS') {
      sweetAlert.success(res.msg);
      // const singleUserBlogs = this.getStore(BlogStore).getUserBlogsWithFocuses(isCurrentUser, user);
      // this.setState({ singleUserBlogs });
    }

    // if(res.msg === 'FOLLOW_USER_SUCCESS' || res.msg === 'CANCEL_FOLLOW_USER_SUCCESS'){
    //   this.setState({
    //     currentUser: this.getStore(UserStore).getCurrentUser(),
    //     user: this.getStore(UserStore).getUserById(userId),
    //     isCurrentUser: this.getStore(UserStore).isCurrentUser(userId)
    //   })
    // }

    // this.setState({
    //   currentUser: this.getStore(UserStore).getCurrentUser(),
    //   user: this.getStore(UserStore).getUserByUsername(username)
    // });
  },

  // handleBlogText(e) {
  //   this.setState({ blogText: e.target.value });
  // },

  // handleMicroBlog() {
  //   const newBlog = {
  //     text: this.state.blogText,
  //     created_at: new Date(),
  //     type: 'microblog',
  //     author: this.state.currentUser._id
  //   };

  //   this.executeAction(BlogActions.AddBlog, newBlog);
  // },

  // getUserBlogsWithFocuses(isCurrentUser, user, singleUserBlogs) {
  //   let displayBlogs = singleUserBlogs;
  //   if (!displayBlogs) {
  //     displayBlogs = this.getStore(BlogStore).getUserBlogsWithFocuses(isCurrentUser, user);
  //   }
  //   return displayBlogs;
  // },

  // changeShowCommentsState(displayBlogs) {
  //   this.setState({ singleUserBlogs: displayBlogs });
  // },

  // changeBlogThumbsUpState() {
  //   const { user, isCurrentUser } = this.state;
  //   this.setState({
  //     singleUserBlogs: this.getStore(BlogStore).getUserBlogsWithFocuses(isCurrentUser, user)
  //   });
  // },

  onViewPinItem(id) {
    const { displayBlogs } = this.state;
    const selectedPin = displayBlogs.find(b => b.id_str === id);
    this.setState({ selectedPin });

    $('#pinModal').on('hidden.bs.modal', () => {
      if (this.hidePinModal) {
        this.hidePinModal();
      }
    });

    ModalsFactory.show('pinModal');
  },

  hidePinModal() {
    const userHomeDom = $('.user-home');
    if (userHomeDom && userHomeDom.length) {
      this.setState({ selectedPin: {} });
    }
  },

  render() {
    const { currentUser, user, displayBlogs, selectedPin } = this.state;
    const { pathname } = this.props.location;
    const sortedBlogs = jsUtils.sortByDate(displayBlogs);
    return (
      <div className="user-home">
        <UserBar path={pathname} user={user} currentUser={currentUser} />
        <div className="home-content">
          <div className="home-left">
            <UserHomeNav path={pathname} user={user} currentUser={currentUser} displayBlogs={displayBlogs} />
          </div>
          <div className="home-right">
            <HomeRightNav path={pathname} currentUser={currentUser} />
            <div className="home-blogs">
              {sortedBlogs.map((blog, index) =>
                <PinItem key={index} onSelect={(id) => this.onViewPinItem(id)} pin={blog} currentUser={currentUser} />
              )}
            </div>
            <Layout.Page>
              <ModalsFactory modalref="pinModal" pin={selectedPin} ModalComponent={PinItemModal} showHeaderAndFooter={false} />
            </Layout.Page>
          </div>
        </div>
      </div>
    );
  }
});

export default UserHome;