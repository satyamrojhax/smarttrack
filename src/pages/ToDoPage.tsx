
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CheckCircle2, Circle, Calendar, BookOpen, Briefcase, Home, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: Date;
}

const categories = [
  { value: 'personal', label: 'Personal', icon: Home, color: 'bg-blue-500' },
  { value: 'work', label: 'Work', icon: Briefcase, color: 'bg-green-500' },
  { value: 'study', label: 'Study', icon: BookOpen, color: 'bg-purple-500' },
  { value: 'important', label: 'Important', icon: Star, color: 'bg-red-500' },
  { value: 'general', label: 'General', icon: Circle, color: 'bg-gray-500' },
];

const ToDoPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('axiom-tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      })));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    if (!isLoading) {
      localStorage.setItem('axiom-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = () => {
    if (!newTask.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      category: selectedCategory,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask('');
    toast({
      title: "Task Added",
      description: `Task added to ${categories.find(c => c.value === selectedCategory)?.label} category`,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully",
    });
  };

  const filteredTasks = tasks.filter(task => 
    filterCategory === 'all' || task.category === filterCategory
  );

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    const Icon = category?.icon || Circle;
    return Icon;
  };

  const getCategoryColor = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.color || 'bg-gray-500';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your tasks..." />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl pb-safe">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Task Manager
        </h1>
        <p className="text-muted-foreground">Organize your tasks by category</p>
      </div>

      {/* Add Task Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter your task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory('all')}
            >
              All Tasks ({tasks.length})
            </Button>
            {categories.map((category) => {
              const Icon = category.icon;
              const count = tasks.filter(t => t.category === category.value).length;
              return (
                <Button
                  key={category.value}
                  variant={filterCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category.value)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {category.label} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground">
                {filterCategory === 'all' 
                  ? "Add your first task to get started!" 
                  : `No tasks in ${categories.find(c => c.value === filterCategory)?.label} category`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const Icon = getCategoryIcon(task.category);
            const categoryColor = getCategoryColor(task.category);
            const categoryLabel = categories.find(c => c.value === task.category)?.label || 'General';
            
            return (
              <Card key={task.id} className={`transition-all duration-200 ${task.completed ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${categoryColor}`}></div>
                          <Icon className="w-3 h-3" />
                          {categoryLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToDoPage;
