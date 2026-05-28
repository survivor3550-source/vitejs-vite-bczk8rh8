import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  onSnapshot,
  startAfter,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase/config';
import { useAuth } from './useAuth';
import { POST_DELETION_DAYS } from '../utils/constants';
import { generateUsername } from '../utils/usernameGenerator';
import { getRandomAvatar } from '../utils/avatarGenerator';
import toast from 'react-hot-toast';

const POSTS_PER_PAGE = 10;

const parseDate = (value, fallback = null) => {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
};

const normalizePost = (post) => {
  const createdAt = parseDate(post.createdAt || post.timestamp, new Date());
  const deletionDate = parseDate(post.deletionDate, new Date(Date.now() + POST_DELETION_DAYS * 24 * 60 * 60 * 1000));

  return {
    ...post,
    id: post.id,
    userId: post.userId || post.uid || 'anonymous',
    content: post.content || '',
    likes: Number(post.likes || 0),
    dislikes: Number(post.dislikes || 0),
    comments: Array.isArray(post.comments) ? post.comments : [],
    status: post.status || 'active',
    createdAt,
    deletionDate,
    updatedAt: parseDate(post.updatedAt, createdAt),
  };
};

export const usePosts = (sortBy = 'latest') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const unsubscribeRef = useRef(null);
  const isFirebaseReady = isFirebaseInitialized();

  // Load posts once auth and Firebase are ready
  useEffect(() => {
    if (!isFirebaseReady) {
      console.warn('Firebase not initialized. Posts will be empty.');
      setPosts([]);
      setLoading(false);
      return;
    }

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    // Firebase real-time listener
    loadFirebasePosts();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [sortBy, isFirebaseReady, authLoading, user]);


  // Load posts from Firebase with real-time updates
  const loadFirebasePosts = () => {
    setLoading(true);
    
    if (!isFirebaseReady || !db) {
      console.warn('Firebase not ready - cannot load posts from Firestore');
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      let postsQuery;
      const postsRef = collection(db, 'posts');

      switch (sortBy) {
        case 'trending':
          postsQuery = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
          break;
        case 'most-liked':
          postsQuery = query(
            postsRef,
            orderBy('likes', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
          break;
        default: // latest
          postsQuery = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
      }

      // Real-time listener
      unsubscribeRef.current = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map(doc => normalizePost({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          deletionDate: doc.data().deletionDate?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        setPosts(sortPosts(postsData, sortBy));
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        setLoading(false);
      }, (err) => {
        console.error('Error loading posts:', err);
        setError(err.message);
        setLoading(false);
        toast.error('Failed to load posts');
      });
    } catch (err) {
      console.error('Error setting up posts listener:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load more posts (pagination)
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading || !lastVisible || !isFirebaseReady) return;

    setLoading(true);

    try {
      const postsRef = collection(db, 'posts');
      let postsQuery;

      switch (sortBy) {
        case 'trending':
          postsQuery = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
          break;
        case 'most-liked':
          postsQuery = query(
            postsRef,
            orderBy('likes', 'desc'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
          break;
        default:
          postsQuery = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
      }

      const snapshot = await getDocs(postsQuery);
      
      const newPosts = snapshot.docs.map(doc => normalizePost({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        deletionDate: doc.data().deletionDate?.toDate(),
      }));

      setPosts(prev => sortPosts([...prev, ...newPosts], sortBy));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error('Error loading more posts:', err);
      toast.error('Failed to load more posts');
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, lastVisible, sortBy, isFirebaseReady]);

  // Refresh posts
  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    
    if (isFirebaseReady) {
      // Firebase will auto-update via listener
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.warn('Firebase not ready - refresh skipped');
    }
    
    setIsRefreshing(false);
  }, [isFirebaseReady]);

  // Add new post
  const addPost = useCallback(async (content) => {
    if (!content.trim()) return;

    const newPost = {
      content: content.trim(),
      userId: user?.uid || 'anonymous',
      username: user?.username || generateUsername(user?.uid || 'temp'),
      avatar: user?.avatar || getRandomAvatar(user?.uid || 'temp'),
      verified: user?.verified || false,
      likes: 0,
      dislikes: 0,
      comments: [],
      status: 'active',
      createdAt: new Date(),
      deletionDate: new Date(Date.now() + POST_DELETION_DAYS * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    if (isFirebaseReady) {
      try {
        const docRef = await addDoc(collection(db, 'posts'), {
          ...newPost,
          createdAt: serverTimestamp(),
          deletionDate: new Date(Date.now() + POST_DELETION_DAYS * 24 * 60 * 60 * 1000),
          updatedAt: serverTimestamp(),
        });

        // Update user's post count
        if (user?.uid) {
          await updateDoc(doc(db, 'users', user.uid), {
            posts: increment(1),
          });
        }

        // Optimistic update: add a local copy so post appears immediately in UI
        try {
          const optimisticPost = normalizePost({
            id: docRef.id,
            ...newPost,
            createdAt: new Date(),
          });

          setPosts(prev => [optimisticPost, ...prev]);
        } catch (e) {
          console.warn('Optimistic post update failed', e);
        }

        toast.success('Confession posted anonymously! 🎭');
        return docRef.id;
      } catch (err) {
        console.error('Error adding post:', err);
        toast.error('Failed to post confession');
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Delete post
  const deletePost = useCallback(async (postId) => {
    if (isFirebaseReady) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        
        // Update user's post count
        if (user?.uid) {
          await updateDoc(doc(db, 'users', user.uid), {
            posts: increment(-1),
          });
        }
        
        toast.success('Post deleted successfully');
      } catch (err) {
        console.error('Error deleting post:', err);
        toast.error('Failed to delete post');
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot delete post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Like post
  const likePost = useCallback(async (postId) => {
    if (isFirebaseReady && user) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid),
        });
      } catch (err) {
        console.error('Error liking post:', err);
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot like post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Unlike post
  const unlikePost = useCallback(async (postId) => {
    if (isFirebaseReady && user) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid),
        });
      } catch (err) {
        console.error('Error unliking post:', err);
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot unlike post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Dislike post
  const dislikePost = useCallback(async (postId) => {
    if (isFirebaseReady && user) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(user.uid),
        });
      } catch (err) {
        console.error('Error disliking post:', err);
        toast.error('Failed to dislike post');
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot dislike post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Undislike post
  const undislikePost = useCallback(async (postId) => {
    if (isFirebaseReady && user) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          dislikes: increment(-1),
          dislikedBy: arrayRemove(user.uid),
        });
      } catch (err) {
        console.error('Error removing dislike from post:', err);
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot remove dislike from post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Add comment to post
  const addComment = useCallback(async (postId, content) => {
    if (!content.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      userId: user?.uid || 'anonymous',
      username: user?.username || generateUsername(user?.uid || 'temp'),
      avatar: user?.avatar || getRandomAvatar(user?.uid || 'temp'),
      content: content.trim(),
      likes: 0,
      createdAt: new Date(),
    };

    if (isFirebaseReady) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: arrayUnion(comment),
        });
        toast.success('Comment added! 💬');
      } catch (err) {
        console.error('Error adding comment:', err);
        toast.error('Failed to add comment');
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot add comment.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Report post
  const reportPost = useCallback(async (postId, reason) => {
    if (isFirebaseReady) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          reports: increment(1),
          reportedBy: arrayUnion(user?.uid),
          reportReason: reason,
        });
        toast.success('Post reported for review');
      } catch (err) {
        console.error('Error reporting post:', err);
        toast.error('Failed to report post');
        throw err;
      }
    } else {
      const message = 'Firebase is not initialized. Cannot report post.';
      toast.error(message);
      throw new Error(message);
    }
  }, [user, isFirebaseReady]);

  // Sort posts helper
  const sortPosts = (postsToSort, sort) => {
    switch (sort) {
      case 'trending':
        return postsToSort.sort((a, b) => {
          const scoreA = (a.likes || 0) * 2 + (a.comments?.length || 0) * 3;
          const scoreB = (b.likes || 0) * 2 + (b.comments?.length || 0) * 3;
          return scoreB - scoreA;
        });
      case 'most-liked':
        return postsToSort.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default: // latest
        return postsToSort.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.timestamp || Date.now());
          const dateB = new Date(b.createdAt || b.timestamp || Date.now());
          return dateB - dateA;
        });
    }
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    isRefreshing,
    addPost,
    deletePost,
    likePost,
    unlikePost,
    dislikePost,
    undislikePost,
    addComment,
    reportPost,
    loadMorePosts,
    refreshPosts,
  };
};

export default usePosts;