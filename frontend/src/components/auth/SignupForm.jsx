import React from 'react';
import FormInput from './FormInput';
import RoleSwitcher from './RoleSwitcher';
import { MultiSelect } from './MultiSelect';
import { MailIcon, LockIcon, UserIcon, Loader2Icon } from './Icons';
import { ROLE, SKILL_LEVEL_OPTIONS } from './constants';

/**
 * Signup form: role switcher (Student/Mentor) then either student fields or mentor fields.
 */
function SignupForm({
  role,
  onRoleChange,
  // Student fields
  firstName,
  lastName,
  studentEmail,
  studentUsername,
  studentPassword,
  studentConfirmPassword,
  targetDomainIds,
  skillLevel,
  domains,
  domainsLoading,
  onFirstNameChange,
  onLastNameChange,
  onStudentEmailChange,
  onStudentUsernameChange,
  onStudentPasswordChange,
  onStudentConfirmPasswordChange,
  onTargetDomainIdsChange,
  onSkillLevelChange,
  // Mentor fields
  mentorEmail,
  mentorUsername,
  mentorPassword,
  mentorConfirmPassword,
  professionalBio,
  expertiseDomainId,
  onMentorEmailChange,
  onMentorUsernameChange,
  onMentorPasswordChange,
  onMentorConfirmPasswordChange,
  onProfessionalBioChange,
  onExpertiseDomainIdChange,
  loading,
  onSubmit,
  onSwitchToLogin,
}) {
  const selectClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50';

  return (
    <>
      <RoleSwitcher role={role} onRoleChange={onRoleChange} />

      <form onSubmit={onSubmit} className="space-y-5 mt-6">
        {/* Student fields */}
        {role === ROLE.STUDENT && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="first-name"
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                required
                disabled={loading}
              />
              <FormInput
                id="last-name"
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <FormInput
              id="student-email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={studentEmail}
              onChange={(e) => onStudentEmailChange(e.target.value)}
              required
              disabled={loading}
              icon={MailIcon}
            />
            <FormInput
              id="student-username"
              label="Username"
              placeholder="johndoe"
              value={studentUsername}
              onChange={(e) => onStudentUsernameChange(e.target.value)}
              required
              disabled={loading}
              icon={UserIcon}
            />
            <FormInput
              id="student-password"
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={studentPassword}
              onChange={(e) => onStudentPasswordChange(e.target.value)}
              required
              disabled={loading}
              minLength={8}
              icon={LockIcon}
            />
            <FormInput
              id="student-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={studentConfirmPassword}
              onChange={(e) => onStudentConfirmPasswordChange(e.target.value)}
              required
              disabled={loading}
              icon={LockIcon}
            />
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Target Domains</label>
              <MultiSelect
                options={domains}
                value={targetDomainIds}
                onChange={onTargetDomainIdsChange}
                placeholder="Select areas of interest"
                disabled={loading || domainsLoading}
              />
            </div>
            <div>
              <label htmlFor="skill-level" className="block text-gray-700 text-sm font-medium mb-1">
                Skill Level (optional)
              </label>
              <select
                id="skill-level"
                value={skillLevel}
                onChange={(e) => onSkillLevelChange(e.target.value)}
                className={selectClass}
                disabled={loading}
              >
                {SKILL_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Mentor fields */}
        {role === ROLE.MENTOR && (
          <>
            <FormInput
              id="mentor-email"
              label="Email"
              type="email"
              placeholder="mentor@example.com"
              value={mentorEmail}
              onChange={(e) => onMentorEmailChange(e.target.value)}
              required
              disabled={loading}
              icon={MailIcon}
            />
            <FormInput
              id="mentor-username"
              label="Username"
              placeholder="mentorjane"
              value={mentorUsername}
              onChange={(e) => onMentorUsernameChange(e.target.value)}
              required
              disabled={loading}
              icon={UserIcon}
            />
            <FormInput
              id="mentor-password"
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={mentorPassword}
              onChange={(e) => onMentorPasswordChange(e.target.value)}
              required
              disabled={loading}
              minLength={8}
              icon={LockIcon}
            />
            <FormInput
              id="mentor-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={mentorConfirmPassword}
              onChange={(e) => onMentorConfirmPasswordChange(e.target.value)}
              required
              disabled={loading}
              icon={LockIcon}
            />
            <div>
              <label htmlFor="professional-bio" className="block text-gray-700 text-sm font-medium mb-1">
                Professional Bio
              </label>
              <textarea
                id="professional-bio"
                placeholder="Tell us about your experience..."
                value={professionalBio}
                onChange={(e) => onProfessionalBioChange(e.target.value)}
                className={selectClass + ' min-h-[100px]'}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="expertise-domain" className="block text-gray-700 text-sm font-medium mb-1">
                Expertise Domain
              </label>
              <select
                id="expertise-domain"
                value={expertiseDomainId}
                onChange={(e) => onExpertiseDomainIdChange(e.target.value)}
                className={selectClass}
                required
                disabled={loading || domainsLoading}
              >
                <option value="">Select domain</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2"
          disabled={loading || (role === ROLE.STUDENT && domainsLoading)}
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account?{' '}
        <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </>
  );
}

export default SignupForm;
