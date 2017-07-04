// import store from '../utils/sessionStorage';
import createStore from 'fluxible/addons/createStore';
import _ from 'lodash';

const BlogStore = createStore({

  storeName: 'BlogStore',

  handlers: {
    'LOAD_BLOGS_SUCCESS': 'loadBlogsSuccess',
    'DELETE_BLOG_SUCCESS': 'deleteBlogSuccess',
    'DELETE_BLOG_FAIL': 'deleteBlogFail',
    'ADD_BLOG_SUCCESS': 'addBlogSuccess',
    'ADD_BLOG_FAIL': 'addBlogFail',
    'EDIT_BLOG': 'editBlog',
    'CANCEL_EDIT_BLOG': 'cancelEditBlog',
    'UPDATE_BLOG_SUCCESS': 'updateBlogSuccess',
    'CONFIRM_DELETE_BLOG': 'confirmDeleteBlog',
    'CANCEL_DELETE_BLOG': 'cancelDeleteBlog',
    'THUMBS_UP_BLOG_SUCCESS': 'thumbsUpBlogSuccess',
    'CANCEL_THUMBS_UP_BLOG_SUCCESS': 'cancelThumbsUpBlogSuccess',
    'ADD_COMMENT_SUCCESS': 'addCommentSuccess',
    'DELETE_COMMENT_SUCCESS': 'deleteCommentSuccess',
    'UPLOAD_IAMGE_SUCCESS': 'uploadImageSuccess'
  },

  initialize() {
    this.blogs = null;
    this.comments = null;
    this.currentBlog = null;
    this.deletedBlog = null;
    this.showLoading = true;
    this.listKeyNumber = 0;
    this.isUpdated = false;
    this.isThumbedUp = false;
  },

  loadBlogsSuccess(res) {
    this.blogs = res;
    this.emitChange();
  },

  // Blogs comments
  addCommentSuccess(res) {
    const newBlog = this.blogs.find(b => b.id_str === res.blogId);
    newBlog.comments.push(res);
    const resObj = { msg: 'COMMENT_SUCCESS', newBlog };

    const idx = this.blogs.findIndex(b => b.id_str === res.blogId);
    this.blogs[idx] = newBlog;
    this.emitChange(resObj);
  },

  deleteCommentSuccess(res) {
    const deletedCommentBlog = this.blogs.find(b => b.id_str === res.blogId);
    const deletedCommentIndex = deletedCommentBlog.comments.findIndex(c => c.id_str === res.deletedCommentId);
    deletedCommentBlog.comments.splice(deletedCommentIndex, 1);

    const resObj = { msg: 'DELETE_COMMENT_SUCCESS', newBlog: deletedCommentBlog };
    const idx = this.blogs.findIndex(b => b.id_str === res.blogId);
    this.blogs[idx] = deletedCommentBlog;
    this.emitChange(resObj);
  },

  getAllComments() {
    return this.comments;
  },
  /* Blogs comments end*/

  addBlogSuccess(res) {
    const resObj = {
      msg: 'CREATE_BLOG_SUCCESS',
      newBlog: res
    };
    this.blogs.push(res);
    this.emitChange(resObj);
  },

  addBlogFail() {
    const resObj = {
      msg: 'ADD_BLOG_FAIL'
    };
    this.emitChange(resObj);
  },

  getAllBlogs() {
    return this.blogs;
  },

  getBlogsWithUsername(currentUser, username) {
    let displayBlogs = [];
    const isCurrentUser = currentUser ? (currentUser.username === username) : false;

    if (isCurrentUser && currentUser) {
      const currentUserBlogs = this.blogs.filter(blog => blog.author.id_str === currentUser.id_str);
      displayBlogs = displayBlogs.concat(currentUserBlogs);
      currentUser.focuses.forEach(focuse => {
        const focuseUserBlogs = this.blogs.filter(blog => blog.author.id_str === focuse.id_str);
        displayBlogs = displayBlogs.concat(focuseUserBlogs);
      });
    }
    else {
      displayBlogs = this.blogs.filter(blog => blog.author.username === username);
    }

    return displayBlogs;
  },

  getCurrentUserBlogs(isCurrentUser, currentUser) {
    const blogs = [];
    if (isCurrentUser && currentUser) {
      this.blogs.forEach(blog => {
        if (blog.author.id_str === currentUser.id_str) {
          blogs.push(blog);
        }
      });
    }

    return blogs;
  },

  changeShowCommentsState(blog) {
    this.blogs.forEach((b, idx) => {
      if (b.id_str === blog.id_str) {
        this.blogs[idx].show_comments = blog.show_comments;
      }
    });
    this.emitChange();
  },

  getBlogsByUserId(userId) {
    const displayUserBlogs = [];
    if (this.blogs) {
      this.blogs.forEach(blog => {
        if (blog.author.id_str === userId) {
          displayUserBlogs.push(blog);
        }
      });
    }
    return displayUserBlogs;
  },

  deleteBlogSuccess(res) {
    const resObj = {
      resCode: 200,
      msg: 'DELETE_BLOG_SUCCESS'
    };
    this.blogs = this.blogs.filter(blog => blog.id_str !== res.deletedBlogId);
    this.deletedBlog = null;
    this.emitChange(resObj);
  },

  deleteBlogFail(err) {
    this.emitChange(err);
  },

  getBlogById(blogId) {
    return this.blogs.find(blog => blog.id_str === blogId);
  },

  getSearchedBlogs(searchText) {
    const searchedBlogs = [];
    this.blogs.forEach(blog => {
      if (blog.title) {
        if (blog.title.toLocaleLowerCase().indexOf(searchText) !== -1
            || blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
          searchedBlogs.push(blog);
        }
      } else if (blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
        searchedBlogs.push(blog);
      }
    });
    return searchedBlogs;
  },

  getSearchedBlogsWithUser(searchText, user) {
    const searchedBlogs = [];
    this.blogs.forEach(blog => {
      if (blog.author.id_str === user.id_str) {
        if (blog.title) {
          if (blog.title.toLocaleLowerCase().indexOf(searchText) !== -1
              || blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
            searchedBlogs.push(blog);
          }
        } else if (blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
          searchedBlogs.push(blog);
        }
      }
    });

    return searchedBlogs;
  },

  getSortedBlogs(sortText) {
    return sortText === 'all blogs' ? this.blogs : this.blogs.filter(blog => blog.type === sortText);
  },

  getSortedBlogsWithUser(sortText, user) {
    const thisUserBlogs = this.blogs.filter(blog => blog.author.id_str === user.id_str);
    const sortedBlogs = this.blogs.filter(blog => blog.type === sortText && blog.author.id_str === user.id_str);
    return sortText === 'all blogs' ? thisUserBlogs : sortedBlogs;
  },

  editBlog(blog) {
    const resObj = {
      msg: 'EDIT_BLOG'
    };
    const currentBlog = this.blogs.find(item => item.id_str === blog.id_str);
    this.currentBlog = currentBlog;
    this.deletedBlog = null;
    this.listKeyNumber += 1;
    this.emitChange(resObj);
  },

  cancelEditBlog() {
    const resObj = {
      msg: 'CANCEL_EDIT_BLOG'
    };
    this.currentBlog = null;
    this.emitChange(resObj);
  },

  getCurrentBlog() {
    return this.currentBlog;
  },

  getDeletedBlog() {
    return this.deletedBlog;
  },

  getIsUpdated() {
    return this.isUpdated;
  },

  updateBlogSuccess(newBlog) {
    const blogs = _.cloneDeep(this.blogs);
    blogs.forEach((item, index) => {
      if (_.isEqual(item.id_str, newBlog.id_str)) {
        blogs[index] = newBlog;
      }
    });
    const resObj = {
      blogs,
      msg: 'UPDATE_BLOG_SUCCESS'
    };
    this.currentBlog = null;
    this.blogs = blogs;
    this.isUpdated = true;
    this.emitChange(resObj);
  },

  confirmDeleteBlog(blog) {
    const resObj = {
      msg: 'CONFIRM_DELETE_BLOG'
    };
    this.deletedBlog = blog;
    this.emitChange(resObj);
  },

  cancelDeleteBlog() {
    const resObj = {
      msg: 'CANCEL_DELETE_BLOG'
    };
    this.deletedBlog = null;
    this.emitChange(resObj);
  },

  thumbsUpBlogSuccess(res) {
    const newBlog = this.blogs.find(b => b.id_str === res.id_str);
    newBlog.likers = res.likers;
    const resObj = { msg: 'THUMBS_UP_BLOG_SUCCESS', newBlog };

    const idx = this.blogs.findIndex(b => b.id_str === res.id_str);
    this.blogs[idx] = newBlog;

    this.emitChange(resObj);
  },

  cancelThumbsUpBlogSuccess(res) {
    const newBlog = _.cloneDeep(this.blogs).find(b => b.id_str === res.id_str);
    newBlog.likers = res.likers;
    const resObj = { msg: 'CANCEL_THUMBS_UP_BLOG_SUCCESS', newBlog };

    const idx = this.blogs.findIndex(b => b.id_str === res.id_str);
    this.blogs[idx] = newBlog;

    this.emitChange(resObj);
  },

  uploadImageSuccess(newUser) {
    this.blogs.forEach((blog, idx) => {
      if (blog.author.id_str === newUser.id_str) {
        this.blogs[idx].author.image_url = newUser.image_url;
      }
    });

    this.emitChange({
      msg: 'BLOG_CHANGE_IMAGE_SUCCESS',
    });
  },

  dehydrate() {
    return {
      blogs: this.blogs,
      currentBlog: this.currentBlog,
      deletedBlog: this.deletedBlog,
      isUpdated: this.isUpdated,
      isThumbedUp: this.isThumbedUp,
      comments: this.comments
    };
  },

  rehydrate(state) {
    this.blogs = state.blogs;
    this.currentBlog = state.currentBlog;
    this.deletedBlog = state.deletedBlog;
    this.isUpdated = state.isUpdated;
    this.isThumbedUp = state.isThumbedUp;
    this.comments = state.comments;
  }
});

export default BlogStore;
