import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Timestamp;
}

const TASKS_PER_PAGE = 5;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  // Fetch tasks with pagination
  const fetchTasks = async (
    startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(TASKS_PER_PAGE)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const newTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        newTasks.push({ id: doc.id, ...(doc.data() as Omit<Task, "id">) });
      });

      setTasks((prevTasks) =>
        startAfterDoc ? [...prevTasks, ...newTasks] : newTasks
      );
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === TASKS_PER_PAGE);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error fetching tasks");
      setLoading(false);
    }
  };

  // Initial load of tasks when the user changes
  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Load more tasks for pagination
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchTasks(lastVisible);
    }
  };

  // Add a new task
  const addTask = async (title: string, description: string) => {
    if (!user) {
      setError("Must be logged in to add tasks");
      return;
    }

    try {
      setError(null);
      const newTaskRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      const newTask = {
        id: newTaskRef.id,
        title,
        description,
        userId: user.uid,
        createdAt: serverTimestamp(),
      } as Task;
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        fetchTasks()
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Error adding task. Please try again.");
      throw err;
    }
  };

  // Update an existing task
  const updateTask = async (id: string, title: string, description: string) => {
    if (!user) {
      setError("Must be logged in to update tasks");
      return;
    }

    try {
      setError(null);
      await updateDoc(doc(db, "tasks", id), {
        title,
        description,
        updatedAt: serverTimestamp(),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, title, description } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Error updating task. Please try again.");
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) {
      setError("Must be logged in to delete tasks");
      return;
    }

    try {
      setError(null);
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error deleting task. Please try again.");
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    hasMore,
    addTask,
    updateTask,
    deleteTask,
    loadMore,
  };
}
