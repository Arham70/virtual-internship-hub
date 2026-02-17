import { client } from './client';

export const adminApi = {
  createAdministrator: (data) => client.post('/admin/administrators/', data),

  // Users (students and mentors only; admin role users are not returned)
  getStudents: () => client.get('/admin/users/students/'),
  getMentors: () => client.get('/admin/users/mentors/'),

  // Skill assessments
  getAssessments: () => client.get('/admin/assessments/'),
  createAssessment: (data) => client.post('/admin/assessments/', data),
  getAssessment: (id) => client.get(`/admin/assessments/${id}/`),
  updateAssessment: (id, data) => client.patch(`/admin/assessments/${id}/`, data),
  deleteAssessment: (id) => client.delete(`/admin/assessments/${id}/`),
  getAssessmentQuestions: (assessmentId) => client.get(`/admin/assessments/${assessmentId}/questions/`),
  createQuestion: (assessmentId, data) => client.post(`/admin/assessments/${assessmentId}/questions/`, data),
};
