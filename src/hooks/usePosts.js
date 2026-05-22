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
  where,
  onSnapshot,
  startAfter,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';
import { DUMMY_POSTS, DUMMY_COMMENTS, POST_DELETION_DAYS } from '../utils/constants';
import { generateUsername } from '../utils/usernameGenerator';
import { getRandomAvatar } from '../utils/avatarGenerator';
import toast from 'react-hot-toast';

const POSTS_PER_PAGE = 10;

export const usePosts = (sortBy = 'latest') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user } = useAuth();
  const unsubscribeRef = useRef(null);
  const isFirebaseReady = false; // Set to true when Firebase is configured

  // Load posts (Firebase or Dummy Data)
  useEffect(() => {
    if (isFirebaseReady) {
      // Firebase real-time listener
      loadFirebasePosts();
    } else {
      // Use dummy data for development
      loadDummyPosts();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [sortBy]);

  // Load dummy posts for development
  const loadDummyPosts = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    let sortedPosts = [...DUMMY_POSTS];

    // Add comments to posts
    sortedPosts = sortedPosts.map(post => ({
      ...post,
      comments: DUMMY_COMMENTS.filter(comment => comment.postId === post.id),
      userId: post.userId,
      likes: post.likes || 0,
      dislikes: post.dislikes || 0,
      reposts: post.reposts || 0,
    }));

    // Filter out expired posts
    sortedPosts = sortedPosts.filter(post => {
      const deletionDate = new Date(post.deletionDate);
      return deletionDate > new Date();
    });

    // Sort posts based on selected filter
    sortedPosts = sortPosts(sortedPosts, sortBy);

    setPosts(sortedPosts);
    setHasMore(false);
    setLoading(false);
  };

  // Load posts from Firebase with real-time updates
  const loadFirebasePosts = () => {
    setLoading(true);
    
    try {
      let postsQuery;
      const postsRef = collection(db, 'posts');
      
      // Base query - only non-deleted posts
      const baseConstraints = [
        where('deletionDate', '>', new Date()),
        where('status', '==', 'active'),
      ];

      switch (sortBy) {
        case 'trending':
          postsQuery = query(
            postsRef,
            ...baseConstraints,
            orderBy('trendingScore', 'desc'),
            limit(POSTS_PER_PAGE)
          );
          break;
        case 'most-liked':
          postsQuery = query(
            postsRef,
            ...baseConstraints,
            orderBy('likes', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
          break;
        default: // latest
          postsQuery = query(
            postsRef,
            ...baseConstraints,
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
      }

      // Real-time listener
      unsubscribeRef.current = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          deletionDate: doc.data().deletionDate?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        setPosts(postsData);
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
      loadDummyPosts(); // Fallback to dummy data
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
            where('deletionDate', '>', new Date()),
            orderBy('trendingScore', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
          break;
        case 'most-liked':
          postsQuery = query(
            postsRef,
            where('deletionDate', '>', new Date()),
            orderBy('likes', 'desc'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
          break;
        default:
          postsQuery = query(
            postsRef,
            where('deletionDate', '>', new Date()),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
      }

      const snapshot = await getDocs(postsQuery);
      
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        deletionDate: doc.data().deletionDate?.toDate(),
      }));

      setPosts(prev => [...prev, ...newPosts]);
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
      await loadDummyPosts();
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
      likes: 0,
      dislikes: 0,
      reposts: 0,
      comments: [],
      trendingScore: 0,
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

        toast.success('Confession posted anonymously! 🎭');
        return docRef.id;
      } catch (err) {
        console.error('Error adding post:', err);
        toast.error('Failed to post confession');
        throw err;
      }
    } else {
      // Dummy add
      const dummyPost = {
        ...newPost,
        id: `post-${Date.now()}`,
        userId: user?.uid || 'current-user',
        createdAt: new Date(),
        deletionDate: new Date(Date.now() + POST_DELETION_DAYS * 24 * 60 * 60 * 1000),
      };

      setPosts(prev => [dummyPost, ...prev]);
      toast.success('Confession posted anonymously! 🎭');
      return dummyPost.id;
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
      // Dummy delete
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
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
      // Dummy like
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      ));
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
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: Math.max(0, (post.likes || 0) - 1) } : post
      ));
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
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), comment] }
          : post
      ));
      toast.success('Comment added! 💬');
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
      toast.success('Post reported for review');
    }
  }, [user, isFirebaseReady]);

  // Sort posts helper
  const sortPosts = (postsToSort, sort) => {
    switch (sort) {
      case 'trending':
        return postsToSort.sort((a, b) => {
          const scoreA = (a.likes || 0) * 2 + (a.comments?.length || 0) * 3 + (a.reposts || 0) * 4;
          const scoreB = (b.likes || 0) * 2 + (b.comments?.length || 0) * 3 + (b.reposts || 0) * 4;
          return scoreB - scoreA;
        });
      case 'most-liked':
        return postsToSort.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default: // latest
        return postsToSort.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
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
    addComment,
    reportPost,
    loadMorePosts,
    refreshPosts,
  };
};

export default usePosts;