import { client } from './client';

export const studentApi = {
  getProfile: () => client.get('/students/profile/'),
  updateProfile: (data) => client.patch('/students/profile/', data),
  getList: () => client.get('/students/'),
  // FR2: Composed skill assessment (10 per target domain or 50 popular)
  getComposedAssessment: () => client.get('/student/assessments/composed/'),
  submitComposedAssessment: (data) => client.post('/student/assessments/composed/submit/', data),
  submitComposedAssessmentML: (data) => client.post('/student/assessments/composed/submit-ml/', data),
  getAttempts: () => client.get('/student/attempts/'),
};
