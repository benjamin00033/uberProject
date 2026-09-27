import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProjectSchedulerStore } from './useProjectSchedulerStore';

describe('useProjectSchedulerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default mock data', () => {
    const store = useProjectSchedulerStore();
    expect(store.projects.length).toBeGreaterThan(0);
    expect(store.members.length).toBeGreaterThan(0);
    expect(store.tasks.length).toBeGreaterThan(0);
  });

  it('computes conflicts correctly', () => {
    const store = useProjectSchedulerStore();
    // Default mock data has Alice with overlapping tasks t1 and t2
    const conflicts = store.conflicts;
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].memberName).toBe('Alice');
  });

  it('can toggle task status', () => {
    const store = useProjectSchedulerStore();
    const task = store.tasks.find(t => t.status === 'todo');
    expect(task).toBeDefined();
    
    if (task) {
      store.toggleTaskStatus(task.id);
      expect(task.status).toBe('in_progress');
      store.toggleTaskStatus(task.id);
      expect(task.status).toBe('done');
      store.toggleTaskStatus(task.id);
      expect(task.status).toBe('todo');
    }
  });

  it('can add a new task', () => {
    const store = useProjectSchedulerStore();
    const initialCount = store.tasks.length;
    store.addTask({
      name: 'New Task',
      projectId: 'p1',
      assignees: ['m1'],
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      status: 'todo'
    });
    expect(store.tasks.length).toBe(initialCount + 1);
    expect(store.tasks[store.tasks.length - 1].name).toBe('New Task');
  });

  it('can manage projects (CRUD)', () => {
    const store = useProjectSchedulerStore();
    const initialProjects = store.projects.length;

    // Create
    store.addProject({
      name: 'Test Project',
      description: 'Test Desc',
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      progress: 0,
      milestones: []
    });
    expect(store.projects.length).toBe(initialProjects + 1);
    const newProjectId = store.projects[store.projects.length - 1].id;

    // Update
    store.updateProject(newProjectId, { name: 'Updated Project' });
    expect(store.projects.find(p => p.id === newProjectId)?.name).toBe('Updated Project');

    // Delete
    store.addTask({
      name: 'Task to be deleted',
      projectId: newProjectId,
      assignees: [],
      startDate: '2026-10-02',
      endDate: '2026-10-05',
      status: 'todo'
    });
    const taskCountBeforeDelete = store.tasks.length;
    store.deleteProject(newProjectId);
    expect(store.projects.length).toBe(initialProjects);
    expect(store.tasks.length).toBeLessThan(taskCountBeforeDelete);
  });

  it('can update task dates', () => {
    const store = useProjectSchedulerStore();
    const task = store.tasks[0];
    const newStart = '2027-01-01';
    const newEnd = '2027-01-10';
    store.updateTaskDates(task.id, newStart, newEnd);
    expect(task.startDate).toBe(newStart);
    expect(task.endDate).toBe(newEnd);
  });

  it('can navigate weeks and compute daysInWeek', () => {
    const store = useProjectSchedulerStore();
    const initialDate = store.currentDate.getTime();
    
    // Check daysInWeek has 7 days
    expect(store.daysInWeek.length).toBe(7);

    store.nextWeek();
    expect(store.currentDate.getTime()).toBeGreaterThan(initialDate);

    store.prevWeek();
    store.prevWeek();
    expect(store.currentDate.getTime()).toBeLessThan(initialDate);
  });
});
